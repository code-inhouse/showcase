import random
from datetime import datetime, date, timedelta
import logging

from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Q
from django.template.loader import render_to_string
from django.urls import reverse

from celery.decorators import periodic_task
from celery.task.schedules import crontab

from dateprofile.models import DateProfile as DP
from chats.models import Message
from likes.models import Like

from .models import Like


DATE_SINCE = date(2016, 1, 1)
DEFAULT_AVATAR = settings.DEFAULT_AVATAR
UNSUBSCRIBE_URL = settings.DOMAIN + reverse('dateprofile:email_unsubscribe')


logger = logging.getLogger('email')


def receivers():
    days = (date.today() - DATE_SINCE).days
    if days % 3 == 0:
        last_login = datetime.now() - timedelta(days=7)
        query = Q(last_seen__gte=last_login)
    elif days % 7 == 0:
        query = Q()
    else:
        last_login = datetime.now() - timedelta(days=3)
        query = Q(last_seen__gte=last_login)
    return DP.objects.filter(
        query &
        Q(is_fake=False) &
        Q(email_subscribed=True) &
        ~Q(user__email='')
    )


def get_notification_mail(profile):
    TYPES = ['message', 'visit', 'like']
    random.shuffle(TYPES)
    matches = profile.ordered_matches[:5]
    for t in TYPES:
        if t == 'message':
            try:
                msg = profile.unread_messages[0]
                sender = msg.sender
                subj = '{}, кто-то написал тебе сообщение!'.format(
                    profile.name
                )
                title = 'Кажется, кто-то оставил тебе сообщение!'
            except IndexError:
                continue
        elif t == 'like':
            try:
                like = profile.unread_likes[0]
                sender = like.liker
                subj = '{}, вы понравились кому-то!'.format(profile.name)
                title = 'Кажется, вы понраились кому-то!'
            except IndexError:
                continue
        else:
            try:
                visit = profile.unread_visits[0]
                sender = visit.visitor
                subj = '{}, кто-то зашел на твою страницу!'.format(
                    profile.name
                )
                title = 'Кажется, кто-то зашел на твою страницу!'
            except IndexError:
                continue
        if subj:
            domain = settings.DOMAIN
            ctx = {
                'url': (
                    domain + reverse('dateprofile:profile', args=[sender.pk])
                ),
                'avatar': (
                    (sender.thumbnail_url or settings.DEFAULT_AVATAR)
                ),
                'profile': sender,
                'unsubscribe_url': UNSUBSCRIBE_URL,
                'domain': settings.DOMAIN,
                'title': title,
                'matches': matches
            }
            plain = render_to_string('emails/notification.txt', ctx)
            html = render_to_string('emails/notification.html', ctx)
            return subj, (plain, html)
    return None, None


def get_like_email(profile):
    try:
        try:
            matches = profile.ordered_matches[1:6]
        except IndexError:
            matches = []
        try:
            match = profile.ordered_matches[0]
        except IndexError:
            return None, None
        match_prob = random.randint(60, 95)
        subj = '{} нравится тебе?'.format(
            'Он' if match.sex == 'male' else 'Она'
        )
        domain = settings.DOMAIN
        ctx = {
            'profile_url': (
                domain + reverse('dateprofile:profile', args=[match.pk])
            ),
            'matches_url': (domain + reverse('likes:game')),
            'avatar': (domain + (match.thumbnail_url or DEFAULT_AVATAR)),
            'profile': match,
            'unsubscribe_url': UNSUBSCRIBE_URL,
            'domain': settings.DOMAIN,
            'probability': match_prob,
            'matches': matches,
        }
        plain = render_to_string('emails/like.txt', ctx)
        html = render_to_string('emails/like.html', ctx)
        return subj, (plain, html)
    except IndexError:
        return None, None


def get_matches_email(profile):
    probabilities = [random.randint(60, 95) for i in range(20)]
    matches =profile.ordered_matches
    if not len(matches):
        return None, None
    subj = (
        'Новые девушки хотят общаться с тобой! Напиши им первый'
        if profile.looking_for == 'female'
        else 'Новые парни хотят общаться с тобой! Напиши им первый'
    )
    d = settings.DOMAIN
    profiles = list(map(
        lambda p: (
            p,
            d + reverse('dateprofile:profile', args=[p.pk]),
            d + (p.thumbnail_url or DEFAULT_AVATAR)
        ),
        matches
    ))
    try:
        sub_matches = matches[3:8]
    except IndexError:
        sub_matches = []
    ctx = {
        'main_matches': matches[:3],
        'sub_matches': sub_matches,
        'profiles': profiles,
        'matches_url': d + reverse('likes:game'),
        'unsubscribe_url': UNSUBSCRIBE_URL,
        'domain': settings.DOMAIN,
        'probabilities': probabilities
    }
    plain = render_to_string('emails/matches.txt', ctx)
    html = render_to_string('emails/matches.html', ctx)
    return subj, (plain, html)


def get_email(profile):
    TYPES = ['notification', 'like', 'matches']
    random.shuffle(TYPES)
    for t in TYPES:
        if t == 'notification':
            subj, body = get_notification_mail(profile)
        elif t == 'like':
            subj, body = get_like_email(profile)
        else:
            subj, body = get_matches_email(profile)
        if subj:
            return subj, body
        continue
    return None, None


@periodic_task(
    run_every=crontab(minute=0, hour=9),  # 9 a.m.
    name='send_notifications',
    ignore_result=True
)
def send_notifications():
    profiles = receivers()
    sent_mails_count = 0
    for profile in profiles:
        subj, body = get_email(profile)
        if not subj:
            continue
        plain, html = body
        logger.info('Sending mail "{}" to {}'.format(
            subj, profile.user.email
        ))
        send_mail(
            subj,
            plain,
            'NaidiSebe <noreply@{}>'.format(settings.DOMAIN.lstrip('http://')),
            [profile.user.email],
            html_message=html)
        sent_mails_count += 1
    return sent_mails_count
