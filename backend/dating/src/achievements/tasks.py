from celery.task.schedules import crontab
from celery.decorators import periodic_task

from dateprofile.models import (
    SessionJournal as SJ,
    DateProfile as DP
)

from .models import ActivityAchievement


@periodic_task(
    run_every=crontab(minute=0, hour=5),
    name='check_activity_achievement',
    ignore_result=True)
def check_activity():
    profiles = DP.objects.all()
    for profile in profiles:
        if ((not profile.task) or
            (not isinstance(profile.task, ActivityAchievement))):
            continue
        sessions = SJ.objects.filter(
            start__gte=profile.task.created,
            profile=profile)
        days = {(x.day, x.month) for x in sessions}
        if len(days) >= profile.task.days_to_pass:
            profile.rating += profile.task.award
            profile.task = None
            profile.save()
