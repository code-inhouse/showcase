from django.db import models


class Feedback(models.Model):
    profile = models.ForeignKey(
        'dateprofile.DateProfile',
        related_name='feedbacks',
    )
    url = models.URLField(blank=False)
    text = models.TextField(max_length=5000, blank=False)
    created = models.DateTimeField(auto_now_add=True)
    is_answered = models.BooleanField(default=False)

    def __str__(self):
        return '{}, {}'.format(self.url, self.text)
