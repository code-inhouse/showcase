import json

from django.db import models
from django.db.models import Q
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist

from . import redis_conn


class Chat(models.Model):
    profile1 = models.ForeignKey('dateprofile.DateProfile',
                                 related_name='+')
    profile2 = models.ForeignKey('dateprofile.DateProfile',
                                 related_name='+')
    created = models.DateTimeField(auto_now_add=True)

    @classmethod
    def get_chat(cls, profile1, profile2):
        try:
            return cls.objects.get(
                (Q(profile1=profile1) & Q(profile2=profile2)) |
                (Q(profile1=profile2) & Q(profile2=profile1)))
        except ObjectDoesNotExist:
            return cls.objects.create(profile1=profile1, profile2=profile2)

    def __str__(self):
        return '{}, {}'.format(self.profile1.user.email,
                               self.profile2.user.email)


class Message(models.Model):
    body = models.TextField(blank=False)
    sender = models.ForeignKey('dateprofile.DateProfile',
                               related_name='sent_messages')
    receiver = models.ForeignKey('dateprofile.DateProfile',
                                 related_name='received_messages')
    chat = models.ForeignKey(Chat, related_name='messages')
    is_read = models.BooleanField(default=False)
    moderator_answered = models.BooleanField(default=False)
    sent = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return 'from: {}, to: {}, content: {}'.format(
            self.sender.user.email,
            self.receiver.user.email,
            self.body)

    def read(self):
        self.is_read = True
        self.save()


class Encourage(models.Model):
    encourager = models.ForeignKey('dateprofile.DateProfile',
                                   related_name='encourages')
    encouraged = models.ForeignKey('dateprofile.DateProfile',
                                   related_name='encouraged_me')
