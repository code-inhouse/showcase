import json

from django.shortcuts import render, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count, Max
from django.http import JsonResponse, HttpResponse
from django.conf import settings
from django.db.models import Q
from django.utils.translation import ugettext as _

from rules.contrib.views import permission_required

from dating.decorators import method_restriction
from dateprofile.models import DateProfile as DP, Visit
from dateprofile.decorators import profile_required
from likes.models import Like
from achievements.dispatcher import dispatch

from .models import Chat, Message, Encourage
from .serializers import (
    MessagesSerializer,
    MessageSerializer,
    ChatSerializer,
    ProfilesOnlineSerializer,
)
from .forms import MessageForm
from . import redis_conn
from .serializers import serialize_messages


@profile_required
def index(req):
    profile = req.user.profile
    profile.update_chat_token()
    try:
        last_msg_datetime = (
            Message.objects
            .filter(Q(sender=req.user.profile) | Q(receiver=req.user.profile))
            .annotate(last_msg_datetime=Max('sent'))
            [0].last_msg_datetime
        )
    except IndexError:
        last_msg_datetime = None
    try:
        selected_with_str = req.GET.get('selected', None)
        if selected_with_str:
            selected_with = int(selected_with_str)
        else:
            selected_with = None
    except ValueError:
        return HttpResponse('Could not parse "selected" param', status=400)
    if selected_with:
        sel_with_dp = get_object_or_404(DP, pk=selected_with)
        sel_chat = Chat.get_chat(profile1=sel_with_dp, profile2=profile)
        sel_chat_id = sel_chat.pk
    else:
        sel_chat_id = -1
    return render(req, 'chats/index.html', {
        'profile': profile,
        'active': 'chat',
        'title': _('Сообщения'),
        'selected': sel_chat_id
    })


@method_restriction('GET')
@profile_required
def chats(req):
    profile = req.user.profile
    try:
        selected = int(req.GET.get('selected', '-1'))
    except ValueError:
        return HttpResponse('can`t parse selected', status=400)
    chats = (
        Chat.objects
        .select_related('profile1', 'profile2',
                        'profile1__avatar', 'profile2__avatar')
        .annotate(msg_count=Count('messages'),
                  last_msg_sent=Max('messages__sent'))
        .filter((Q(msg_count__gt=0) | Q(pk=selected)) &
                (Q(profile1=profile) | Q(profile2=profile)))
        .extra(select={
            'unread_count': '''
            SELECT COUNT(*)
            FROM chats_message
            WHERE chats_message.chat_id=chats_chat.id AND
                  chats_message.is_read=false AND
                  chats_message.receiver_id={}
            '''.format(profile.pk)
        })
    )
    return JsonResponse([{
        'id': chat.pk,
        'selected': selected == chat.pk,
        'lastMsgTimestamp': chat.last_msg_sent,
        'unreadCount': chat.unread_count,
        'withWho': {
            'name': (
                chat.profile2.name
                if profile == chat.profile1
                else chat.profile1.name
            ),
            'photo': (
                chat.profile2.thumbnail_url
                if profile == chat.profile1
                else chat.profile1.thumbnail_url
            ),
            'id': (
                chat.profile2.pk
                if profile == chat.profile1
                else chat.profile1.pk
            ),
            'firstInMessages': (
                chat.profile2.is_first_in_messages()
                if profile == chat.profile1
                else chat.profile1.is_first_in_messages()
            ),
            'lastSeen': (
                chat.profile2.last_seen
                if profile == chat.profile1
                else chat.profile1.last_seen
            ),
            'isAdmin': (
                chat.profile2.status == 'moderator'
                if profile == chat.profile1
                else chat.profile1.status == 'moderator'
            ),
            'status': (
                chat.profile2.status
                if profile == chat.profile1
                else chat.profile1.status
            )
        }
    } for chat in chats], safe=False)


@method_restriction('GET')
@profile_required
def messages(req, chat_id):
    last_message_pk = req.GET.get('last', None)
    try:
        profile = DP.objects.get(user=req.user)
        chat = profile.chats.filter(pk=chat_id)[0]
    except IndexError:
        return HttpResponse('You have no right to view'
                            ' messages from this chat',
                            status=403)
    if last_message_pk:
        last_message = get_object_or_404(Message, pk=last_message_pk)
        messages = chat.messages.filter(sent__lt=last_message.sent)
    else:
        messages = chat.messages
    messages = (
        messages
        .select_related('sender', 'sender__avatar')
        .order_by('-sent')
        [:50]
    )
    serialized = MessagesSerializer.serialize(messages, profile, chat)
    serialized['last'] = len(messages) < 50
    return JsonResponse(serialized)


@method_restriction('POST')
@profile_required
def new_message(req, chat_id):
    profile = DP.objects.get(user=req.user)
    data = {
        'chat': chat_id,
        'sender': profile.id,
        'body': req.POST.get('body', None)
    }
    form = MessageForm(data)
    if form.is_valid():
        instance = form.save()
        dispatch('ADD_MESSAGE', profile, message=instance)
        return JsonResponse(
            MessageSerializer.serialize(instance, profile, instance.chat))
    return HttpResponse('', status=400)


@method_restriction('GET')
@profile_required
def get_chat(req, chat_id):
    try:
        profile = req.user.profile
        chat = (
            profile.chats
            .filter(pk=chat_id)
            .select_related('profile1', 'profile2')[0]
        )
        return JsonResponse(ChatSerializer.serialize(chat, profile))
    except IndexError:
        raise Http404


@method_restriction('GET')
@profile_required
def onlines(req):
    ids = json.loads(req.GET.get('ids', '[]'))
    profiles = DP.objects.filter(pk__in=ids)
    return JsonResponse(ProfilesOnlineSerializer.serialize(profiles))


@profile_required
def ping(req):
    return HttpResponse('ok')


@method_restriction('POST')
@profile_required
def read_messages(req, chat_id):
    profile = req.user.profile
    try:
        chat = Chat.objects.get(Q(pk=chat_id) &
                                (Q(profile1=profile) | Q(profile2=profile)))
    except ObjectDoesNotExist:
        raise Http404
    sender= chat.profile2 if chat.profile1 == profile else chat.profile1
    Message.objects.filter(chat=chat, sender=sender).update(is_read=True)
    msg = json.dumps({
        'purpose': 'NOTIFY_READ',
        'chat_id': chat.pk,
        'receiver': {
            'id': sender.pk
        }
    })
    redis_conn.publish(settings.REDIS_MSG_CHANNEL, msg)
    return HttpResponse('ok')


@method_restriction('POST')
@profile_required
def send_message(req):
    profile = req.user.profile
    try:
        receiver_id = int(req.POST.get('to', None))
    except ValueError:
        return HttpResponse('Receiver id is not int', status=400)
    receiver = get_object_or_404(DP, pk=receiver_id)
    chat = Chat.get_chat(profile1=profile, profile2=receiver)
    form = MessageForm({
        'body': req.POST.get('message', ''),
        'sender': profile.id,
        'chat': chat.id
    })
    if form.is_valid():
        msg = form.save()
        dispatch('ADD_MESSAGE', profile, message=msg)
        return HttpResponse('ok')
    return HttpResponse(str(form.errors), status=400)


@method_restriction('GET')
@profile_required
def unread_messages(req):
    profile = req.user.profile
    jsoned = MessagesSerializer.serialize([], profile)
    jsoned['count'] = (
        Message.objects
        .filter(receiver=profile, is_read=False)
        .distinct('chat')
        .count()
    )
    jsoned['notifications'] = {
        'visits': (
            Visit.objects
            .filter(notified=False, visited=profile)
            .count()
        ),
        'likes': Like.objects.filter(notified=False, liked=profile).count()
    }
    return JsonResponse(jsoned)


@method_restriction('POST')
@profile_required
def encourage(req, profile_id):
    profile = req.user.profile
    encouraged = get_object_or_404(DP, pk=int(profile_id))
    try:
        Encourage.objects.get(encourager=profile, encouraged=encouraged)
        return HttpResponse('You have already encourage this profile',
                            status=400)
    except ObjectDoesNotExist:
        chat = Chat.get_chat(profile1=profile, profile2=encouraged)
        Message.objects.create(
            chat=chat,
            sender=profile,
            receiver=encouraged,
            body='Я хочу узнать о тебе побольше, ответь на вопросы в профиле!'
        )
        Encourage.objects.create(encourager=profile, encouraged=encouraged)
        return HttpResponse('ok')


@profile_required
def popups_unread_messages_count(req):
    profile = req.user.profile
    unread_messages_count = profile.unread_messages.count()
    try:
        last_message_id = profile.unread_messages.latest('sent').pk
    except ObjectDoesNotExist:
        last_message_id = 0
    return JsonResponse({
        'count': unread_messages_count,
        'last_id': last_message_id
    })


@profile_required
def popups_unread_messages(req):
    try:
        last_id = int(req.GET.get('last_id', 0))
    except ValueError:
        return HttpResponse('Could not parse last_id',status=400)
    if not last_id:
        unread_messages = (
            req.user.profile
            .unread_messages
            .select_related('sender', 'sender__avatar')
            [:50]
        )
    else:
        message = get_object_or_404(Message, pk=last_id)
        unread_messages = (
            req.user.profile
            .unread_messages
            .filter(sent__gt=message.sent)
            .select_related('sender', 'sender__avatar')
        )
    return JsonResponse(serialize_messages(unread_messages))
