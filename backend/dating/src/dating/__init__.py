from django.contrib.gis.geoip2 import GeoIP2

from .celery import app as celery_app


geoip = GeoIP2()
