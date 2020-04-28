from django.http import JsonResponse
from django.shortcuts import render
from django.conf import settings
from django.core.management import call_command

from constance import config


def index(request):
    return render(request, 'index.html', {})


def settings_view(request):
    return JsonResponse({
        key: getattr(config, key)
        for key in settings.CONSTANCE_CONFIG.keys()
    })


def run_migrations(request):
    call_command('migrate')
    call_command('createcachetable')
    return JsonResponse({'ok': True})
