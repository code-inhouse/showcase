import uuid
import os
import json

from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.core.files.storage import FileSystemStorage

from filemanager.constants import STRATEGY_GCE
from filemanager.service import upload_file, get_link


@login_required
def update_avatar_view(request):
    avatar = request.FILES['avatar']
    folder = '/tmp'
    fs = FileSystemStorage(location=folder)
    filename = fs.save(avatar.name, avatar)
    filepath = os.path.join(folder, filename)
    cf = upload_file(STRATEGY_GCE, filepath, avatar.name, settings.MEDIA_BUCKET, request.user.id)
    request.user.profile.avatar = get_link(cf)
    request.user.profile.save()
    os.remove(filepath)
    return HttpResponse(request.user.profile.avatar)


@login_required
def set_candle_settings(request):
    request.user.profile.candle_settings = request.POST.get('settings', '{}')
    request.user.profile.save()
    return HttpResponse('ok')

@login_required
def set_marketwatch_settings(request):
    key = request.POST.get('key')
    value = request.POST.get('value')
    if not key:
        return HttpResponse('`key` not found in params', status=400)
    marketwatch_settings = json.loads(request.user.profile.marketwatch_settings)
    marketwatch_settings[key] = value
    request.user.profile.marketwatch_settings = json.dumps(marketwatch_settings)
    request.user.profile.save()
    return HttpResponse('ok')
