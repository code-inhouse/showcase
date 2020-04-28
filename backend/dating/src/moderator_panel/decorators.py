from functools import wraps

from django.urls import reverse
from django.shortcuts import redirect
from django.core.exceptions import ObjectDoesNotExist

from dating.utils import composed
from dateprofile.decorators import profile_required


def _moderator_required(view):

    @wraps(view)
    def wrapped(req, *args, **kwargs):
        not_moderator = redirect(reverse('dateprofile:profile'))
        try:
            profile = req.user.profile
            if profile.status == 'moderator':
                return view(req, *args, **kwargs)
        except ObjectDoesNotExist:
            return not_moderator
        return not_moderator

    return wrapped

moderator_required = composed(_moderator_required, profile_required)
