from urllib.parse import urljoin

from django.http import HttpResponseRedirect
from django.conf import settings



def redirect_middleware(get_response):
    def middleware(request):
        if settings.APP_MODE == 'dev':
            return get_response(request)
        whitelist = [
            'calendar-7n3kz3n2iq-uc.a.run.app',
            'calendar-vkuvzj75ya-uc.a.run.app',
            'calendar.inhouse.band',
            'itiner.io'
        ]
        if request.META['HTTP_HOST'] not in whitelist:
            return HttpResponseRedirect(urljoin('//itiner.io', request.path))
        return get_response(request)

    return middleware
