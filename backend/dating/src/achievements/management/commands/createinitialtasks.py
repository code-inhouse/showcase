from django.core.management.base import BaseCommand
from django.db.models import Q

from dateprofile.models import DateProfile as DP
from achievements.models import AvatarAchievement, VisitAchievement


class Command(BaseCommand):
    help = (
        'Initializes tasks for users who signed up before '
        'the time when achievements were introduced'
    )

    def handle(self, *args, **options):
        profiles = DP.objects.all()
        for profile in profiles:
            if (not profile.task) and (profile.rating == 0):
                if profile.avatar:
                    profile.task = (
                        VisitAchievement.objects.create())
                    profile.rating = 10
                    profile.save()
                else:
                    profile.task = (
                        AvatarAchievement.objects.create())
                    profile.rating = 0
                    profile.save()
