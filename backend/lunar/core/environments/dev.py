import os

from core.components.variables import BASE_DIR


DEBUG = True
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.join(BASE_DIR, 'google.json')

SECRET_KEY = 'xck@3ru6ht$kt$11jhl5itqp)wa)o9$zc^ij1#m068v7yd1-s-'

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = '320395926432-c9t43a39u1eqhpghsu44hguargitictr.apps.googleusercontent.com'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = 'UQO7t8Pre3gvFGmCm5oLJroC'

SOCIAL_AUTH_FACEBOOK_KEY = '630303024135186'
SOCIAL_AUTH_FACEBOOK_SECRET = '9287e0aa5c3cd4c48f8a203cfb778e61'

SOCIAL_AUTH_TWITTER_KEY = 'yIpdv0U08WMEG672O32BH6OML'
SOCIAL_AUTH_TWITTER_SECRET = 'QRzzFstoSO7OVh17On53WTUbi2ysseyGeBZFGs7sxPBg60ixzs'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

MEDIA_BUCKET = 'lunar-dev'

STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

STATIC_ROOT = None
