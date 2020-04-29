from django.conf.urls import url

from . import views


urlpatterns = [
    url(r'^like/(?P<profile_id>\d+)/$', views.like, name='like'),
    url(r'^unlike/(?P<profile_id>\d+)/$', views.unlike, name='unlike'),
    url(r'^dislike/(?P<profile_id>\d+)/$', views.dislike, name='dislike'),
    url(r'^matches/$', views.matches, name='matches'),
    url(r'^game/$', views.matches_page, name='game'),
    url(r'^info/$', views.info_page, name='info'),
    url(r'^likes/count/$',
        views.unread_likes_count,
        name='unread_likes_count'),
    url(r'^viewmutual/(?P<like_id>\d+)/$',
        views.view_mutual,
        name='view_mutual'),
    url(r'^mutual/$', views.mutual, name='mutual'),
    url(r'^mutual/count/$', views.mutual_count, name='mutual_count'),
    url(r'^likes/unread/$', views.unread_likes, name='unread_likes'),
    url(r'^likes/(?P<like_id>\d+)/delete/$',
        views.delete_like,
        name='delete_like')
]
