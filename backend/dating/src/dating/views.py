from django.shortcuts import redirect
from django.urls import reverse
from django.http import HttpResponse


def password_reset_from_key_done(req):
    return redirect(reverse('account_login'))


def social_login_cancel(req):
    return redirect(reverse('account_signup'))


def mobile_cb_tmp(req):
    return HttpResponse('ok')

def redirect_tmp(req):
    return HttpResponse('ok')

def tariffication_tmp(req):
    return HttpResponse('ok')
