from datetime import timedelta
from uuid import uuid4

from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from cities_light.models import City


def _get_id():
    return uuid4().hex[:8]


class Plan(models.Model):
    name = models.CharField(max_length=200)
    edit_id = models.CharField(
        max_length=45, null=False, db_index=True, default=_get_id
    )
    read_id = models.CharField(
        max_length=45, null=False, db_index=True, default=_get_id
    )
    start_date = models.DateField(null=False)
    end_date = models.DateField(null=False)
    description = models.TextField(blank=True, default='')
    place = models.CharField(max_length=200, blank=True, default='')  # deprecated
    city = models.ForeignKey(City, null=True, on_delete=models.SET_NULL)
    parent_plan = models.ForeignKey('events.Plan', null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    @property
    def days(self):
        days = [self.start_date]
        cur_date = self.start_date
        while cur_date != self.end_date:
            cur_date += timedelta(days=1)
            days.append(cur_date)
        return days

    def __str__(self):
        return self.name


class TimeSlot(models.Model):
    plan = models.ForeignKey(
        Plan,
        null=False,
        on_delete=models.CASCADE,
        related_name='timeslots'
    )
    name = models.CharField(max_length=200)
    hour = models.IntegerField(validators=[
        MinValueValidator(0), MaxValueValidator(23)
    ])
    minute = models.IntegerField(validators=[
        MinValueValidator(0), MaxValueValidator(59)
    ])
    duration = models.IntegerField(null=False)
    date = models.DateField(null=False)
    description = models.TextField(blank=True, default='')
    place = models.CharField(max_length=200, default='')
    color = models.CharField(max_length=100, default='grey')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
