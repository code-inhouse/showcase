from django.db import models


class Answer(models.Model):
    question = models.ForeignKey('Question', related_name='answers')
    profile = models.ForeignKey('DateProfile', related_name='answers')
    text = models.TextField(max_length=2000)
    created = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('question', 'profile')
