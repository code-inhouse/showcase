from django.db import models


class RepostLog(models.Model):
    CHOICES = (
        ('fb', 'facebook'),
        ('ok', 'odnoklassniki'),
        ('vk', 'vkontakte')
    )

    repost_source = models.CharField(choices=CHOICES, max_length=20)
    created = models.DateTimeField(auto_now_add=True)
