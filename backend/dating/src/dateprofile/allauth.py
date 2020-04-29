import hashlib
import datetime
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import render
from django.conf import settings

from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import (
    DefaultSocialAccountAdapter as AllauthSocialAccountAdapter
)

from activities.tasks import start_emulation
from dateprofile.models import DateProfile as DP

from .forms import ChangeEmailForm


class DateprofileAccountAdapter(DefaultAccountAdapter):

    def get_login_redirect_url(self, request):
        return '/profile'

    def respond_email_verification_sent(self, request, user):
        m = hashlib.md5()
        m.update(((settings.SECRET_KEY + str(user.pk)).encode('utf-8')))
        form = ChangeEmailForm(initial={
            'secret': m.hexdigest(),
            'user': user
        })
        return render(request, 'dateprofile/email_confirmation.html', {
            'email': user.email,
            'form': form
        })

    def get_from_email(self):
        return settings.EMAIL_FROM

    def send_mail(self, template_prefix, email, context):
        context['domain'] = settings.DOMAIN
        context['unsubscribe_url'] = (
            settings.DOMAIN +
            reverse('dateprofile:email_unsubscribe')
        )
        print(context)
        msg = self.render_mail(template_prefix, email, context)
        msg.send()

    def confirm_email(self, req, email_address):
        super().confirm_email(req, email_address)
        profile = DP.objects.get(user__email=email_address.email)
        profile.send_welcome_msg()
        if profile.avatar:
            start_emulation(profile)



class SocialAccountAdapter(AllauthSocialAccountAdapter):
    pass
