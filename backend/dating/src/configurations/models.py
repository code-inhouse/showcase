import json

from django.db import models
from django.contrib.postgres.fields import ArrayField
from django import forms
from django.core.cache import cache
from django.core.validators import MinValueValidator, MaxValueValidator

from solo.models import SingletonModel

from dateprofile.models.dateprofile.constants import (
    STATUSES, SEXS, MIN_AGE, MAX_AGE)


class ChoiceArrayField(ArrayField):
    """
    A field that allows us to store an array of choices.

    Uses Django 1.9's postgres ArrayField
    and a MultipleChoiceField for its formfield.
    """

    def formfield(self, **kwargs):
        defaults = {
            'form_class': forms.MultipleChoiceField,
            'choices': self.base_field.choices,
        }
        defaults.update(kwargs)
        # Skip our parent's formfield implementation completely as we don't
        # care for it.
        # pylint:disable=bad-super-call
        return super(ArrayField, self).formfield(**defaults)


class RulesConfig(SingletonModel):
    can_message = ChoiceArrayField(
        models.CharField(
            max_length=30,
            choices=STATUSES,
            verbose_name='Кто может отправлять сообщения'),
        default=list
    )
    can_see_visits = ChoiceArrayField(
        models.CharField(
            max_length=30,
            choices=STATUSES,
            verbose_name='Кто может видеть визиты'),
        default=list
    )
    can_see_likes = ChoiceArrayField(
        models.CharField(
            max_length=30,
            choices=STATUSES,
            verbose_name=''),
        default=list
    )
    is_free_for_women = models.BooleanField(
        default=True,
        verbose_name='Есть ли у женщин доступ ко всему'
    )
    likes_per_day = models.IntegerField(
        default=20,
        verbose_name='Количество бесплатных лайков в день'
    )

    def __str__(self):
        return 'Конфигурация уровней доступа'

    def as_dict(self):
        return {
            'can_message': self.can_message,
            'can_see_visits': self.can_see_visits,
            'can_see_likes': self.can_see_likes,
            'is_free_for_women': self.is_free_for_women,
            'likes_per_day': self.likes_per_day
        }

    @classmethod
    def get_cached_config(cls):
        CACHE_KEY = 'RULES_CONFIG'
        cached_config = cache.get(CACHE_KEY)
        if cached_config:
            return json.loads(cached_config)
        TIMEOUT = 60 * 5  # 5 minutes
        config = cls.get_solo().as_dict()
        cache.set(CACHE_KEY, json.dumps(config), TIMEOUT)
        return config

    class Meta:
        verbose_name = 'Конфигурация уровней доступа'


class DefaultActivityConfig(SingletonModel):
    likes_per_interval = models.IntegerField(
        default=3, validators=[MinValueValidator(0)])
    visits_per_interval = models.IntegerField(
        default=5, validators=[MinValueValidator(0)])
    messages_per_interval = models.IntegerField(
        default=2, validators=[MinValueValidator(0)])

    class Meta:
        verbose_name = 'Конфигурация активности по-умолчанию'


class ActivityConfig(models.Model):
    age_from = models.IntegerField(
        validators=[
            MinValueValidator(MIN_AGE),
            MaxValueValidator(MAX_AGE)
        ]
    )
    age_to = models.IntegerField(
        validators=[
            MinValueValidator(MIN_AGE),
            MaxValueValidator(MAX_AGE)
        ]
    )
    sex = models.CharField(max_length=6,
                           choices=SEXS,
                           blank=True,
                           null=True)
    likes_per_interval = models.IntegerField(
        default=3, validators=[MinValueValidator(0)])
    visits_per_interval = models.IntegerField(
        default=5, validators=[MinValueValidator(0)])
    messages_per_interval = models.IntegerField(
        default=2, validators=[MinValueValidator(0)])

    def __str__(self):
        return 'from {} to {},{}likes={}, visits={}, messages={}'.format(
            self.age_from,
            self.age_to,
            ' {}, '.format(self.sex) if self.sex else '',
            self.likes_per_interval,
            self.visits_per_interval,
            self.messages_per_interval
        )


def _get_default_interval_config():
    return [180, 3600, 86400]  # seconds


class IntervalsConfig(SingletonModel):
    intervals = ArrayField(
        models.IntegerField(validators=[MinValueValidator(0)]),
        default=_get_default_interval_config
    )

    def __str__(self):
        return ', '.join(str(i) for i in self.intervals)

    class Meta:
        verbose_name = 'Конфигурация интервалов'


class BannersConfig(SingletonModel):
    CACHE_KEY = 'SHOW_BANNERS'
    CACHE_TIMEOUT = 5 * 60

    show_vip = models.BooleanField(
        default=True,
        blank=False,
        null=False
    )
    show_premium = models.BooleanField(
        default=True,
        blank=False,
        null=False
    )
    show_lottery = models.BooleanField(
        default=True,
        blank=False,
        null=False
    )
    show_emulation = models.BooleanField(
        default=True,
        blank=False,
        null=False
    )

    class Meta:
        verbose_name = 'Конфигурация баннеров'

    @classmethod
    def cached(cls):
        cached_obj = cache.get(cls.CACHE_KEY)
        if cached_obj:
            return json.loads(cached_obj)
        conf = cls.get_solo()
        to_json = {
           'show_vip': conf.show_vip,
           'show_premium': conf.show_premium,
           'show_lottery': conf.show_lottery,
           'show_emulation': conf.show_emulation,
        }
        cached_obj = json.dumps(to_json)
        cache.set(cls.CACHE_KEY, cached_obj, cls.CACHE_TIMEOUT)
        return to_json

    def __str__(self):
        return 'Banners config'
