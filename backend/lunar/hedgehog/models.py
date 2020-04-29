from django.contrib.auth.models import User
from django.db import models


class HedgehogAuth(models.Model):
    iv = models.TextField()
    cipher_text = models.TextField()
    lookup_key = models.TextField()


class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.TextField()
