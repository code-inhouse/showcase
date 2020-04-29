from django.conf import settings

from dating.utils import array_serializer as f_array_serializer

def array_serializer(serializer, name):

    class _ArraySerializer(object):
        @staticmethod
        def serialize(items, *args, **kwargs):
            res = {}
            res[name] = [serializer.serialize(item, *args, **kwargs)
                         for item in items]
            return res

    return _ArraySerializer


class MessageSerializer(object):

    @classmethod
    def serialize(cls, message, profile, chat=None):
        if chat:
            return cls.serialize_with_chat(message, profile, chat)
        return cls.serialize_without_chat(message, profile)

    @classmethod
    def serialize_without_chat(cls, message, profile):
        return {
            'id': message.id,
            'body': message.body,
            'own': message.sender == profile,
            'read': message.is_read,
            'sent': message.sent,
            'from': {
                'id': message.sender.pk,
                'avatar': (
                    message.sender.avatar.small_thumbnail_url
                   if message.sender.avatar
                   else None
                ),
                'name': message.sender.name,
                'firstInMessages': (
                    message
                    .sender
                    .is_first_in_messages()),
                'status': message.sender.status
            }
        }

    @classmethod
    def serialize_with_chat(cls, message, profile, chat):
        return {
            'id': message.id,
            'chatId': chat.id,
            'body': message.body,
            'own': message.sender.pk == profile.pk,
            'read': message.is_read,
            'sent': message.sent
        }

MessagesSerializer = array_serializer(MessageSerializer, 'messages')


class ChatSerializer(object):

    @staticmethod
    def serialize(chat, profile):
        partner = chat.profile2 if chat.profile1 == profile else chat.profile1
        return {
            'id': chat.pk,
            'withWho': {
                'name': partner.name,
                'photo': (
                    partner.avatar.thumbnail_url
                    if partner.avatar
                    else settings.DEFAULT_AVATAR
                ),
                'pk': partner.pk,
                'id': partner.pk,
                'status': partner.status
            },
            'canSendMessage': False  # profile.user.has_perm('send_message_to', partner)
        }


class ProfileOnlineSerializer(object):

    @staticmethod
    def serialize(profile):
        return {
            'id': profile.pk,
            'lastSeen': profile.last_seen
        }


ProfilesOnlineSerializer = array_serializer(ProfileOnlineSerializer,
                                            'profiles')


def serialize_message(message):
    return {
        'id': message.pk,
        'sender_id': message.sender.id,
        'sender_avatar': message.sender.thumbnail_url,
        'sender_name': message.sender.name,
        'sender_sex': message.sender.sex,
        'sent': message.sent
    }

serialize_messages = f_array_serializer(serialize_message)
