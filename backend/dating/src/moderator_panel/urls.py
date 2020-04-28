from django.conf.urls import url

from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^feeds/$', views.feedbacks_page, name='feedbacks_page'),
    url(r'^photos/$', views.photos_page, name='photos_page'),
    url(r'^photos_list/$', views.photos, name='photos'),
    url(r'^feedbacks/$', views.feedbacks, name='feedbacks'),
    url(r'^reply/$', views.reply, name='reply'),
    url(r'^mark_feedback/$',
        views.mark_feedback_answered,
        name='mark_feedback'),
    url(r'^mark_message/$',
        views.mark_message_answered,
        name='mark_message'),
    url(r'^photo/reject/',
        views.reject_photo,
        name='reject_photo'),
    url(r'^photo/moderate/',
        views.moderate_photo,
        name='moderate_photo'),
    url(r'^delete/(?P<profile_id>\d+)/$',
        views.delete_profile,
        name='delete_profile')
]
