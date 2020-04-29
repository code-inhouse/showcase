from django.db import models


class EmailTracking(models.Model):
    profile = models.ForeignKey('dateprofile.DateProfile',
                                null=True,
                                blank=True)
    url = models.CharField(max_length=300,
                           null=True,
                           blank=True)
    email_type = models.CharField(max_length=300,
                                  null=True,
                                  blank=True)
    comment = models.CharField(max_length=100,
                               null=True,
                               blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
