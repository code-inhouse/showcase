from django.core.management.base import BaseCommand

from dateprofile.models import DateProfile as DP


class Command(BaseCommand):
    help = 'Sets cities for profiles who have ip'

    def handle(self, *args, **options):
        profiles = (
            DP.objects
            .exclude(ip='')
        )
        for profile in profiles:
            profile._city = profile.get_city()
            profile.save()
