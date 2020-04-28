from django.db import models


class Question(models.Model):
    text = models.CharField(max_length=2000)
    holder = models.CharField(max_length=300, default='Ваш ответ')
    text_en = models.CharField(max_length=2000, default='')
    holder_en = models.CharField(max_length=2000,
                                 default='Your answer')

    def __str__(self):
        return self.text
