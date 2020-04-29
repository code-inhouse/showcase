from datetime import timedelta as td
import dateutil.parser

from django.utils import timezone
from datetime import timedelta

from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.db.models.expressions import F
from django.utils.deprecation import MiddlewareMixin
from django.utils import translation

from dateprofile.models import DateProfile as DP, SessionJournal as SJ


class LastUserActivityMiddleware(MiddlewareMixin):
    KEY = "last-activity"

    def process_request(self, request):
        if request.user.is_authenticated():
            try:
                last_activity_str = request.session.get(self.KEY)
                last_activity = dateutil.parser.parse(last_activity_str)
            except (ValueError, AttributeError):
                last_activity = None
            # If key is old enough, update database.
            threshold = settings.LAST_ACTIVITY_INTERVAL_SECS
            too_old_time = timezone.now() - td(seconds=threshold)
            if not last_activity or last_activity < too_old_time:
                last_seen = timezone.now()
                try:
                    profile = DP.objects.filter(user=request.user.pk)[0]
                    profile.last_seen = last_seen
                    profile.save()
                    try:
                        SECONDS_IN_MINUTE = 60
                        session_endtime = (
                            timezone.now() -
                            timedelta(minutes=(
                                threshold // SECONDS_IN_MINUTE + 1
                            ))
                        )
                        sj = SJ.objects.filter(
                            profile=profile,
                            end__gt=session_endtime)[0]
                    except IndexError:
                        time = timezone.now()
                        sj = SJ(
                            profile=profile,
                            start=timezone.now(),
                            end=timezone.now()
                        )
                    sj.end = timezone.now()
                    sj.save()
                except IndexError:
                    pass
                request.session[self.KEY] = timezone.now().isoformat()

        return None


class RussianLangMiddleware(MiddlewareMixin):

    def process_request(self, request):
        request.LANG = 'ru-RU'
        translation.activate(request.LANG)
        request.LANGUAGE_CODE = request.LANG


class DisableCSRF(MiddlewareMixin):
    def process_request(self, request):
            setattr(request, '_dont_enforce_csrf_checks', True)
