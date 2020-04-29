from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.core.management import call_command


@login_required
def index(request):
    return render(request, 'index.html', {})


@login_required
def template(request):
    return render(request, 'template.html', {})


def login(request):
    if request.user.is_authenticated:
        return redirect('/')
    return render(request, 'login.html', {})


def run_migrations(request):
    call_command('migrate')
    return JsonResponse({'ok': True})
