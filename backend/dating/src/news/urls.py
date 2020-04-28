from django.conf.urls import url

from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^post/$', views.create, name='create'),
    url(r'^post/delete/(?P<post_id>\d+)/$',
        views.delete,
        name='delete'),
    url(r'^posts/$', views.posts, name='posts'),
]
