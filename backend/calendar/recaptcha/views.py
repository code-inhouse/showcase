from django.http import JsonResponse
from django.conf import settings

from .bl import should_show_captcha


def should_show_captcha_view(request):
    return JsonResponse({
        'visible': should_show_captcha(request),
        'clientKey': settings.RECAPTCHA_CLIENT_KEY,
    })
