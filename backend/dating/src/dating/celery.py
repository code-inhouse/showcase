import os

from celery import Celery
from django.conf import settings

if os.environ.get('ENV', '') == 'production':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dating.settings.base')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dating.settings.prod')
app = Celery('dating')

app.config_from_object('django.conf:settings')
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
