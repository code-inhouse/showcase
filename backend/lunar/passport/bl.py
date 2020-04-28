from django.contrib.auth.models import User
from django.contrib.auth import login
from django.db import transaction
from django.conf import settings
from django.template.loader import render_to_string
from django.core.mail import send_mail

from mail.queue import add_task
from personal.models import Profile
from .models import EmailConfirmation


def register(request, email, password, name):
    user = User.objects.create_user(
        email,
        email,
        password,
        first_name=name,
    )
    Profile.objects.get_or_create(user_id=user.id)
    email_confirmation = EmailConfirmation.objects.create(user=user)
    add_task(lambda: send_confirmation_mail(email_confirmation.id))
    return user


def send_confirmation_mail(confirmation_id: int):
    email_confirmation = EmailConfirmation.objects.get(
        id=confirmation_id, kind=EmailConfirmation.KIND_REGISTRATION
    )
    url = f'{settings.HOST}/confirm/{email_confirmation.token.hex}/'
    if settings.APP_ENV == 'dev':
        print(url)
        return
    context = {
        'email_link': url,
    }
    txt_body = render_to_string('passport/mail/confirm_email.txt', context)
    html_body = render_to_string('passport/mail/confirm_email.html', context)
    subj = 'Confirm your email'
    send_mail(subj, txt_body, settings.EMAIL_SENDER,
              [email_confirmation.user.email], html_message=html_body)



def confirm_mail(request, email_token: str):
    try:
        confirmation = EmailConfirmation.objects.get(used=False, token=email_token)
    except EmailConfirmation.DoesNotExist:
        return False
    confirmation.use()
    login(request, confirmation.user, backend='django.contrib.auth.backends.ModelBackend')
    return True


def request_password_recovery(email):
    try:
        user = User.objects.get(username=email)
    except User.DoesNotExist:
        return False
    email_confirmation = EmailConfirmation.objects.create(
        user=user, kind=EmailConfirmation.KIND_RECOVERY
    )
    add_task(lambda: send_password_recovery_mail(email_confirmation.id))
    return True


def send_password_recovery_mail(confirmation_id):
    email_confirmation = EmailConfirmation.objects.get(id=confirmation_id)
    url = f'{settings.HOST}/auth/confirm-recover/{email_confirmation.token.hex}'
    if settings.APP_ENV == 'dev':
        print(url)
        return
    context = {
        'email_link': url,
    }
    txt_body = render_to_string('passport/mail/recover_password.txt', context)
    html_body = render_to_string('passport/mail/recover_password.html', context)
    subj = 'Recover password'
    send_mail(subj, txt_body, settings.EMAIL_SENDER,
              [email_confirmation.user.email], html_message=html_body)


@transaction.atomic
def recover_password(request, token, new_password):
    try:
        email_confirmation = EmailConfirmation.objects.get(
            used=False, kind=EmailConfirmation.KIND_RECOVERY
        )
    except EmailConfirmation.DoesNotExist:
        return False
    email_confirmation.user.set_password(new_password)
    email_confirmation.user.save()
    email_confirmation.use()
    login(request, email_confirmation.user, backend='django.contrib.auth.backends.ModelBackend')
    return True
