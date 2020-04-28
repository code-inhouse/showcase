from functools import wraps

from django.shortcuts import redirect
from django.urls import reverse
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.contrib import messages


from dating.utils import composed

from .models import DateProfile as DP


def no_profile(req):
    logout(req)
    messages.add_message(
        req,
        messages.WARNING,
        'У этого пользователя отсутствует профиль')
    return redirect(reverse('account_login'))



def _profile_required(view):

    @wraps(view)
    def wrapped(req, *args, **kwargs):
        try:
            profile = req.user.profile
            if profile.verified:
                return view(req, *args, **kwargs)
            return no_profile(req)
        except DP.DoesNotExist:
            return no_profile(req)

    return wrapped


profile_required = composed(_profile_required, login_required)
