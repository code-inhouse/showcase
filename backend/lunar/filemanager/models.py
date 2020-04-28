from django.db import models
from django.contrib.auth import get_user_model

from .constants import STRATEGIES


class CloudFile(models.Model):
    uploaded_by = models.ForeignKey(get_user_model(), null=True, on_delete=models.SET_NULL)
    size = models.PositiveIntegerField()
    bucket = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=50, default='application/octet-stream')
    strategy = models.CharField(max_length=20, choices=STRATEGIES)
    name = models.CharField(max_length=255, unique=True)
    human_name = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
