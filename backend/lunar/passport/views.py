import json

from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.views.decorators.http import require_http_methods
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout

from .bl import (
    register,
    confirm_mail,
    request_password_recovery,
    recover_password,
)
from .forms import (
    RegisterForm,
    RequestRecoveryForm,
    NewPasswordForm,
    UpdatePersonalDataForm,
    UpdateSocialDataForm,
)


@require_http_methods(['GET'])
def user_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'user': None})
    user = request.user
    return JsonResponse({
        'user': {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'avatar': user.profile.avatar,
            'phone_number': user.profile.phone_number,
            'facebook': user.profile.facebook,
            'twitter': user.profile.twitter,
            'linkedin': user.profile.linkedin,
            'candle_settings': json.loads(user.profile.candle_settings),
            'marketwatch_settings': json.loads(user.profile.marketwatch_settings),
        }
    })


@require_http_methods(['POST'])
@login_required
def update_personal_data(request):
    form = UpdatePersonalDataForm(request.POST)
    if not form.is_valid():
        return JsonResponse({'errors': form.errors}, status=400)
    user = request.user
    user.first_name = form.cleaned_data['first_name']
    user.last_name = form.cleaned_data['last_name']
    user.profile.phone_number = form.cleaned_data['phone_number']
    user.save()
    user.profile.save()
    return HttpResponse('ok')


@require_http_methods(['POST'])
@login_required
def update_social_data(request):
    form = UpdateSocialDataForm(request.POST)
    if not form.is_valid():
        return JsonResponse({'errors': form.errors}, status=400)
    profile = request.user.profile
    profile.facebook = form.cleaned_data['facebook']
    profile.twitter = form.cleaned_data['twitter']
    profile.linkedin = form.cleaned_data['linkedin']
    profile.save()
    return HttpResponse('ok')



@require_http_methods(['POST'])
def register_view(request):
    form = RegisterForm(request.POST)
    if not form.is_valid():
        return JsonResponse({'errors': form.errors})
    register(request, form.cleaned_data['email'], form.cleaned_data['password'],
             form.cleaned_data['name'])
    return HttpResponse('ok')


def confirm_email_view(request, token):
    if not confirm_mail(request, token):
        return HttpResponse('Link is invalid')
    return HttpResponseRedirect('/')


@require_http_methods(['POST'])
def login_view(request):
    form = AuthenticationForm(request, data=request.POST)
    if not form.is_valid():
        return JsonResponse({'errors': form.errors})
    login(request, form.get_user(), backend='django.contrib.auth.backends.ModelBackend')
    return HttpResponse('ok')


@require_http_methods(['POST'])
def logout_view(request):
    logout(request)
    return HttpResponse('ok')


def request_recovery_view(request):
    form = RequestRecoveryForm(request.POST)
    if not form.is_valid():
        return JsonResponse({'errors': form.errors})
    return JsonResponse({
        'ok': request_password_recovery(form.cleaned_data['email'])
    })


def confirm_recovery_view(request):
    form = NewPasswordForm(request.POST)
    if not form.is_valid():
        return JsonResponse({'errors': form.errors})
    return JsonResponse({
        'ok': recover_password(
            request, form.cleaned_data['token'], form.cleaned_data['new_password']
        )
    })
