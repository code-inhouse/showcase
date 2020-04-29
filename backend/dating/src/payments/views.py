from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponse
from django.db import transaction

from dateprofile.decorators import profile_required
from dating.decorators import method_restriction

from .models import PaymentClick, PaymentTry, PaymentCreation
from .forms import (
    PaymentClickForm,
    PaymentTryForm,
    PaymentCreationForm)


@profile_required
def index(req):
    return render(req, 'payments/purchase.html', {
        'active': 'purchase'
    })


def click_redirection(req):
    url = req.GET.get('url', '')
    button = req.GET.get('button', '')
    source = req.GET.get('source', 'unknown')
    form = PaymentClickForm(req.GET, initial={
        'button': button,
        'page_url': url,
        'source': source
    })
    if form.is_valid():
        instance = form.save(commit=False)
        instance.profile = req.user.profile
        instance.save()
    suffix = ''
    if button == 'vip':
        suffix = '?selected=vip'
    return redirect(reverse('payments:purchase') + suffix)


def make_create_view(form):

    @profile_required
    @method_restriction('POST')
    def _view(req):
        f = form(req.POST)
        if f.is_valid():
            instance = f.save(commit=False)
            instance.profile = req.user.profile
            instance.save()
            return HttpResponse('ok')
        return HttpResponst(str(f.erros), status=400)

    return _view


payment_try_create = make_create_view(PaymentTryForm)


@profile_required
@method_restriction('POST')
@transaction.atomic
def payment_creation(req):
    form = PaymentCreationForm(req.POST)
    if form.is_valid():
        profile = req.user.profile
        instance = form.save(commit=False)
        if profile.may_purchase(instance.subscription_type):
            instance.profile = profile
            instance.save()
            profile.status = instance.subscription_type
            profile.save()
            return HttpResponse('ok')
    return HttpResponse(str(form.errors), status=400)
