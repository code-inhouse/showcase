from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=100, blank=True)
    facebook = models.CharField(max_length=100, blank=True)
    twitter = models.CharField(max_length=100, blank=True)
    linkedin = models.CharField(max_length=100, blank=True)
    avatar = models.CharField(max_length=255,
                              default='/static/assets/images/default.png')
    candle_settings = models.TextField(default='{}')
    marketwatch_settings = models.TextField(default='{}')
