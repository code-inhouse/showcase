from django.db import models


class QuestionnaireAnswer(models.Model):

    ANSWERS = (
        ('yes', 'yes'),
        ('no', 'no'),
    )

    profile = models.ForeignKey('DateProfile',
                                related_name='questionnaire_answers',
                                blank=False)
    question = models.CharField(max_length=300)
    answer = models.CharField(max_length=5, choices=ANSWERS)
