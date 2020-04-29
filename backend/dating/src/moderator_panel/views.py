from heapq import merge
from datetime import datetime, timedelta
import itertools as it

from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.db.models import Q

from feedbacks.models import Feedback
from chats.models import Chat, Message
from dateprofile.models import DateProfile as DP, Photo
from dating.utils import disable_browser_cache
from dating.decorators import method_restriction
from news.models import Post

from .decorators import moderator_required
from .models import PhotoRejection
from .serializers import (
    serialize_message,
    serialize_feedback,
    serialize_photo
)
from .forms import (
    ReplyForm,
    MarkFeedbackForm,
    MarkMessageForm,
    PhotoRejectionForm,
    PhotoModerationForm
)


@moderator_required
def index(req):
    return render(req, 'moderator_panel/index.html', {})


def serialize_element(elem):
    if elem.__class__ == Message:
        return serialize_message(elem)
    if elem.__class__ == Feedback:
        return serialize_feedback(elem)
    raise ValueError('elem\'s class is neither '
                     'Feedback nor Message')


@moderator_required
@method_restriction('GET')
def feedbacks(req):
    moders = DP.objects.filter(status='moderator')
    feedbacks = (
        Feedback.objects
        .filter(is_answered=False)
        .order_by('created')
    )
    messages = (
        Message.objects
        .filter(receiver__in=moders,
                moderator_answered=False)
        .order_by('sent')
    )
    merged = it.islice(
        merge(feedbacks,
              messages,
              key=lambda x: (x.created
                             if x.__class__ == Feedback
                             else x.sent)),
        50)
    return disable_browser_cache(
            JsonResponse([serialize_element(elem)
                          for elem in merged],
                         safe=False))


@moderator_required
@method_restriction('POST')
def reply(req):
    form = ReplyForm(req.POST)
    if form.is_valid():
        profile = form.cleaned_data['profile']
        moderator = profile.matching_support
        if not moderator:
            return HttpResponse('No matching support',
                                status=500)
        chat = Chat.get_chat(profile, moderator)
        Message.objects.filter(
            chat=chat,
            receiver=moderator
        ).update(is_read=True)
        Message.objects.create(
            sender=moderator,
            receiver=profile,
            body=form.cleaned_data['body'],
            chat=chat
        )
        if profile.user.email:
            send_feedback_email(profile, form.cleaned_data['body'])
        return HttpResponse('ok')
    return HttpResponse(str(form.errors), status=400)


@moderator_required
@method_restriction('POST')
def mark_feedback_answered(req):
    form = MarkFeedbackForm(req.POST)
    if form.is_valid():
        feedback = form.cleaned_data['feedback']
        feedback.is_answered = True
        feedback.save()
        return HttpResponse('ok')
    return HttpResponse(str(form.errors), status=400)


@moderator_required
@method_restriction('POST')
def mark_message_answered(req):
    form = MarkMessageForm(req.POST)
    if form.is_valid():
        message = form.cleaned_data['message']
        message.moderator_answered = True
        message.save()
        return HttpResponse('ok')
    return HttpResponse(str(form.errors), status=400)


@moderator_required
def feedbacks_page(req):
    return render(req, 'moderator_panel/feedbacks_page.html', {})


@moderator_required
def photos_page(req):
    return render(req, 'moderator_panel/photos_page.html', {})


@moderator_required
def photos(req):
    photo_posts = (
        Post.objects
        .filter(post_type='add_photo')
        .values_list('pk', flat=True)
    )
    photos = (
        Photo.objects
        .select_related('profile', 'profile__avatar')
        .filter(Q(is_deleted=False) &
                Q(is_moderated=False) &
                Q(profile__is_fake=False) &
                ~Q(posts__in=photo_posts))
        .order_by('created')
        [:20]
    )
    return JsonResponse([serialize_photo(photo)
                         for photo in photos],
                        safe=False)


@moderator_required
@method_restriction('POST')
def reject_photo(req):
    form = PhotoRejectionForm(req.POST)
    if form.is_valid():
        photo = form.cleaned_data['photo']
        photo.is_deleted = True
        photo.is_moderated = True
        profile = photo.profile
        support = profile.matching_support
        if not support:
            return HttpResponse('No matching support', status=500)
        if profile.avatar == photo:
            profile.avatar = None
        rejection = form.save(commit=False)
        rejection.rejector = req.user.profile
        rejection.save()
        inform_profile(profile, rejection)
        photo.save()
        profile.save()
        return HttpResponse('ok')
    return HttpResponse(str(form.errors), status=400)


@moderator_required
@method_restriction('POST')
def moderate_photo(req):
    form = PhotoModerationForm(req.POST)
    if form.is_valid():
        photo = form.cleaned_data['photo']
        photo.is_moderated = True
        photo.save()
        return HttpResponse('ok')
    return HttpResponse(str(form.errors), status=400)


def inform_profile(profile, rejection):
    REJECTION_THRESHOLD = 20  # minutes
    last_rejection_time = (
        datetime.now() - timedelta(minutes=REJECTION_THRESHOLD)
    )
    should_send_rejection_msg = not (
        PhotoRejection.objects
        .select_related('photo', 'photo__profile')
        .filter(Q(photo__profile=profile) &
                Q(created__gte=last_rejection_time) &
                ~Q(pk=rejection.pk))
        .exists()
    )
    if should_send_rejection_msg:
        reason = rejection.reason
        photo = rejection.photo
        send_rejection_msg(profile, photo, reason)
        if profile.user.email:
            send_rejection_email(profile, photo, reason)


def send_rejection_msg(profile, photo, reason):
    support = profile.matching_support
    chat = Chat.get_chat(profile, support)
    msg_body = (
        'Ваша фотография нарушала правила сайта и была удалена. '
        'Пожалуйста, згрузите новое фото. Это должна быть '
        'ваша фотография. Запрещено использовать фотографии:\n'
        '- несовершеннолетних детей\n'
        '- фотографии из Интернета и фото знаменитостей\n'
        '- изображения эротического характера\n'
        '- фотографии животных\n'
        '- предметы / картинки / рисунки'
    )
    Message.objects.create(
        sender=support,
        receiver=profile,
        body=msg_body,
        chat=chat
    )


def send_rejection_email(profile, photo, reason):
    ctx = {
        'domain': settings.DOMAIN,
        'src': photo.image.url,
        'reason': reason
    }
    plain = render_to_string(
        'moderator_panel/emails/photo_rejection.txt', ctx)
    html = render_to_string(
        'moderator_panel/emails/photo_rejection.html', ctx)
    send_mail(
        'Фото на сайте было отклонено :(',
        plain,
        'NaidiSebe <noreply@{}>'.format(
            settings.DOMAIN.lstrip('http://')),
        [profile.user.email],
        html_message=html)


def send_feedback_email(profile, reply):
    ctx = {
        'domain': settings.DOMAIN,
        'reply': reply
    }
    plain = render_to_string(
        'moderator_panel/emails/feedback.txt', ctx)
    html = render_to_string(
        'moderator_panel/emails/feedback.html', ctx)
    send_mail(
        'Наш модератор ответил на ваш вопрос',
        plain,
        'NaidiSebe <noreply@{}>'.format(
            settings.DOMAIN.lstrip('http://')),
        [profile.user.email],
        html_message=html)


@moderator_required
@method_restriction('POST')
def delete_profile(req, profile_id):
    profile = get_object_or_404(DP, pk=profile_id)
    profile.avatar = None
    profile.is_deleted = True
    Photo.objects.filter(profile=profile).update(is_deleted=True)
    Post.objects.filter(profile=profile).update(is_deleted=True)
    profile.save()
    profile.user.is_active = False
    profile.user.save()
    return HttpResponse('ok')
