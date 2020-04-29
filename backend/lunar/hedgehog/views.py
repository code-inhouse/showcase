import hashlib

from django.db import transaction
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import login, logout

from personal.models import Profile
from .models import HedgehogAuth, Wallet
from .forms import InsertAuthDataForm, CreateUserForm


def insert_auth_data_view(request):
    form = InsertAuthDataForm(request.POST)
    if not form.is_valid():
        return JsonResponse({'errors': form.errors}, status=400)
    HedgehogAuth.objects.update_or_create(
        lookup_key=form.cleaned_data['lookup_key'], defaults={
            'iv': form.cleaned_data['iv'],
            'cipher_text': form.cleaned_data['cipher_text'],
        }
    )
    return HttpResponse('ok')


def retrieve_data_view(request):
    lookup_key = request.GET.get('lookup_key', '')
    try:
        auth_data = HedgehogAuth.objects.get(lookup_key=lookup_key)
    except HedgehogAuth.DoesNotExist:
        return HttpResponse('not found', status=404)
    return JsonResponse({
        'iv': auth_data.iv,
        'cipherText': auth_data.cipher_text,
        'lookupKey': auth_data.lookup_key,
    })


@transaction.atomic
def create_wallet(request):
    form = CreateUserForm(request.POST)
    if not form.is_valid():
        return JsonResponse({'errors': form.errors}, status=400)
    address = form.cleaned_data['address']
    password = hashlib.sha224(bytes(address, 'utf-8')).hexdigest()
    user = User.objects.create_user(
        username=form.cleaned_data['username'],
        password=password
    )
    Wallet.objects.create(user=user, address=address)
    Profile.objects.create(user=user)
    login(request, user, backend='django.contrib.auth.backends.ModelBackend')
    return HttpResponse('ok')
