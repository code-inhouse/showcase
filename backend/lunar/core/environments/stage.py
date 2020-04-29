
import os

from core.components.variables import BASE_DIR

DEBUG = True

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.join(BASE_DIR, 'google.json')
MEDIA_BUCKET = 'lunar-dev'
HOST = os.getenv('HOST', 'http://lunar.inhouse.band')

STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'
STATIC_ROOT = None
