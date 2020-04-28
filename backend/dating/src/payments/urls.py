from django.conf.urls import url

from . import views


urlpatterns = [
    url(r'^purchase/$', views.index, name='purchase'),
    url(r'^try/$',
        views.payment_try_create,
        name='create_try'),
    url(r'^click/$',
        views.click_redirection,
        name='click'),
    url(r'^pay/$',
        views.payment_creation,
        name='create_payment'),
]
