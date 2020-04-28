from django.apps import AppConfig

import rules

from . import rules as chat_rules


class ChatsConfig(AppConfig):
    name = 'chats'

    def ready(self):
        import chats.signals
        rules.add_perm(
            'send_message',
            chat_rules.can_send_message)
        rules.add_perm(
            'send_message_to',
            chat_rules.can_send_message_to)

