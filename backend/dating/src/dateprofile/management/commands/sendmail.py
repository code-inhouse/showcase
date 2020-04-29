from django.core.mail import send_mail
from django.conf import settings
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Sends test email'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str)
        parser.add_argument('htmlpath', type=str)

    def handle(self, *args, **options):
        with open(options['htmlpath']) as letter:
          send_mail(
            'Test mail',
            'Test mail',
            'NaidiSebe <noreply@{}>'.format(settings.DOMAIN),
            [options['email']],
            html_message=letter.read())
        return 'Success'
