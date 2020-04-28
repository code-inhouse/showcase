from django.core.management.base import BaseCommand
from django.db.models import Q

from dateprofile.models import DateProfile as DP


class Command(BaseCommand):
    help = (
        'Generates small thumbnail '
        'for users who have avatars'
    )


    def handle(self, *args, **options):
        profiles = DP.objects.filter(~Q(avatar=None))
        for profile in profiles:
            try:
                profile.avatar.add_small_thumbnail(save=True)
                print('done %d' % profile.pk)
            except ValueError:
                print('skipped %d' % profile.pk)
