from django.db import models


class Like(models.Model):
    liker = models.ForeignKey('dateprofile.DateProfile', related_name='likes')
    liked = models.ForeignKey('dateprofile.DateProfile',
                              related_name='liked_mes')
    created = models.DateTimeField(auto_now_add=True)
    notified = models.BooleanField(default=False)
    mutual_viewed = models.BooleanField(default=False)
    liker_deleted = models.BooleanField(default=False)
    liked_deleted = models.BooleanField(default=False)

    @classmethod
    def deleted(cls):
        return cls.objects.filter(is_deleted=True)

    def pseudo_delete(self, profile):
        if self.liker == profile:
            self.liker_deleted = True
        elif self.liked == profile:
            self.liked_deleted = True
        else:
            raise ValueError('profile is nor liker neither liked')
        self.save()

    class Meta:
        unique_together = ('liker', 'liked',)

    def __str__(self):
        return '{} {}'.format(self.liker.user.email,
                              self.liked.user.email)


class Dislike(models.Model):
    disliker = models.ForeignKey('dateprofile.DateProfile',
                                 related_name='dislikes')
    disliked = models.ForeignKey('dateprofile.DateProfile',
                                 related_name='disliked_mes')
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('disliker', 'disliked',)

    def __str__(self):
        return '{} {}'.format(self.disliker.user.email,
                              self.disliked.user.email)
