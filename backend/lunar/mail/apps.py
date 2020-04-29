from django.apps import AppConfig

from .worker import MailWorker


class MailConfig(AppConfig):
    name = 'mail'

    def ready(self):
        MailWorker().start()
