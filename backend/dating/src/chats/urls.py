from django.conf.urls import url

from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^chats/', views.chats, name='chats'),
    url(r'^(?P<chat_id>\d+)/messages/$', views.messages, name='messages'),
    url(r'^(?P<chat_id>\d+)/message/$', views.new_message, name='new_message'),
    url(r'^(?P<chat_id>\d+)/$', views.get_chat, name='chat'),
    url(r'^online/$', views.onlines, name='onlines'),
    url(r'^ping/$', views.ping, name='ping'),
    url(r'^(?P<chat_id>\d+)/read_messages/$', views.read_messages,
        name='read_messages'),
    url(r'^sendmessage/$', views.send_message, name='send_message'),
    url(r'^unreadmessages/$', views.unread_messages, name='unread_messages'),
    url(r'^encourage/(?P<profile_id>\d+)/$',
        views.encourage,
        name='encourage'),
    url(r'^messages/count/$',
        views.popups_unread_messages_count,
        name='popups_unread_messages_count'),
    url(r'^messages/unread/$',
        views.popups_unread_messages,
        name='popups_unread_messages'),
]
