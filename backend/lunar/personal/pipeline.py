import os
import uuid

import requests
from social_core.pipeline.user import create_user as _create_user

from django.conf import settings

from filemanager.service import upload_file, get_link
from filemanager.constants import STRATEGY_GCE
from mail.queue import add_task
from .models import Profile


def download_and_save(user_id, url):
    data = requests.get(url, allow_redirects=True).content
    filename = f'/tmp/{uuid.uuid4().hex}'
    with open(filename, 'wb') as file_:
        file_.write(data)
    cloud_file = upload_file(STRATEGY_GCE, filename, uuid.uuid4().hex[:5], settings.MEDIA_BUCKET , user_id)
    Profile.objects.filter(user_id=user_id).update(avatar=get_link(cloud_file))
    os.remove(filename)


def _pre_save_picture(user, picture_url):
    if picture_url:
        user.profile.avatar = picture_url
        add_task(lambda: download_and_save(user.id, picture_url))


def associate_social_data(user, is_new, social=None, response=None, **kwargs):
    if not response:
        response = {}
    if not hasattr(user, 'profile'):
        Profile.objects.create(user=user)
    if is_new and social:
        if social.provider == 'facebook':
            fb_id = social.uid
            user.profile.facebook = response.get('link', '')
            try:
                picture_url = response['picture']['data']['url']
            except KeyError:
                picture_url = None
            _pre_save_picture(user, picture_url)
            user.profile.save()
        elif social.provider == 'twitter':
            twitter_id = response.get('screen_name')
            if not twitter_id:
                return
            picture_url = response.get('profile_image_url_https')
            _pre_save_picture(user, picture_url)
            user.profile.twitter = f'https://twitter.com/{twitter_id}'
            user.profile.save()
        elif social.provider == 'google-oauth2':
            picture_url = response.get('picture')
            _pre_save_picture(user, picture_url)
