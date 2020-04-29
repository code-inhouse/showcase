import json

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

from .models import Message
from . import redis_conn


@receiver(post_save, sender=Message)
def create_message(sender, instance, created, **kwargs):
    if created:
        msg = json.dumps({
            'id': instance.id,
            'sender': {
                'id': instance.sender.pk,
                'name': instance.sender.name
            },
            'receiver': {
                'id': instance.receiver.pk,
                'name': instance.receiver.name
            },
            'body': instance.body,
            'chatId': instance.chat.pk,
            'sent': instance.sent.isoformat()
        })
        redis_conn.publish(settings.REDIS_MSG_CHANNEL, msg)
