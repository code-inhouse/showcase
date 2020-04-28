from django.urls import path, re_path, include
from django.contrib import admin

from events.urls import *  # noqa
from core.router import router
from .views import index, settings_view, run_migrations
from recaptcha.views import should_show_captcha_view


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/captcha/', should_show_captcha_view),
    path('api/settings/', settings_view),
    path('run_migrations/', run_migrations),
    path('api/', include(router.urls)),
    re_path('^(?!api).*', index, name='index'),
]
