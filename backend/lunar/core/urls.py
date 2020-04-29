from django.contrib import admin
from django.urls import path, re_path, include

from . import views
from passport import views as passport_views
from personal import views as personal_views
from hedgehog import views as hedgehog_views

urlpatterns = [
    re_path('^auth.*', views.login),
    path('', include('social_django.urls', namespace='social')),
    path('admin/', admin.site.urls),
    path('api/user/', passport_views.user_view),
    path('api/update_personal_data/', passport_views.update_personal_data),
    path('api/update_social_data/', passport_views.update_social_data),
    path('api/register/', passport_views.register_view),
    path('api/login/', passport_views.login_view),
    path('api/logout/', passport_views.logout_view),
    path('api/upload_avatar/', personal_views.update_avatar_view),
    path('api/request_recovery/', passport_views.request_recovery_view),
    path('api/confirm_recovery/', passport_views.confirm_recovery_view),
    path('api/run_migrations/', views.run_migrations),

    path('api/hedgehog/authentication/', hedgehog_views.insert_auth_data_view),
    path('api/hedgehog/lookup/', hedgehog_views.retrieve_data_view),
    path('api/hedgehog/users/', hedgehog_views.create_wallet),

    path('api/set_candle_settings/', personal_views.set_candle_settings),
    path('api/set_marketwatch_settings/', personal_views.set_marketwatch_settings),

    path('confirm/<str:token>/', passport_views.confirm_email_view),
    re_path(r'^(?!assets|static).*', views.index),
]
