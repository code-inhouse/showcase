from django.db import models


class PhotoRejection(models.Model):
    rejector = models.ForeignKey('dateprofile.DateProfile')
    photo = models.ForeignKey('dateprofile.Photo')
    reason = models.CharField(max_length=100, blank=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'photo_rejections'
