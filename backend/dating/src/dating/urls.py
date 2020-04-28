from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.i18n import i18n_patterns

from django.conf.urls.static import static
from django.contrib import admin

from . import views


urlpatterns = [
    url(r'^gxvkfl/', admin.site.urls),
    url(r'^', include('dateprofile.urls', namespace='dateprofile')),
    url(r'^likes/', include('likes.urls', namespace='likes')),
    url(r'^chats/', include('chats.urls', namespace='chats')),
    url(r'^feedbacks/',
        include('feedbacks.urls', namespace='feedbacks')),
    url(r'^news/', include('news.urls', namespace='news')),
    url(r'^payments/',
        include('payments.urls', namespace='payments')),
    url(r'^achievements/',
        include('achievements.urls', namespace='achievements')),
    url(r'^moderator/',
        include('moderator_panel.urls', namespace='moderator')),
    url(r"^accounts/password/reset/key/done/$",
        views.password_reset_from_key_done,
        name="account_reset_password_from_key_done"),
    url(r"^accounts/social/login/cancelled/$",
        views.social_login_cancel,
        name="socialaccount_login_cancelled"),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^i18n/', include('django.conf.urls.i18n')),
    url(r'^payments/mobile/callback/$', views.mobile_cb_tmp),
    url(r'^payments/mobile/redirect/$', views.redirect_tmp),
    url(r'^payments/mobile/tariffication/$', views.tariffication_tmp),
]

urlpatterns += i18n_patterns(*urlpatterns)

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
    urlpatterns += [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ]
