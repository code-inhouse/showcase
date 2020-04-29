from django.core.cache import cache

from rest_framework.permissions import BasePermission
from constance import config

from recaptcha.bl import verify_captcha, get_captcha_response, incr_attempts
from .models import Plan


def get_plan(plan_id):
    key = 'plan-' + str(plan_id)
    cached = cache.get(key)
    if not cached:
        cached = Plan.objects.get(id=plan_id)
        cache.set(key, cached, 3600)
    return cached


def validate_edit_header(request, plan_id):
    edit_id = request.META.get('HTTP_X_EDITID')
    if not edit_id:
        return False
    try:
        if not get_plan(plan_id).edit_id == edit_id:
            return False
    except Plan.DoesNotExist:
        return False
    return True


def validate_edit_header_presence(request):
    edit_id = request.META.get('HTTP_X_EDITID')
    if not edit_id:
        return False
    return Plan.objects.filter(edit_id=edit_id).exists()


class TimeSlotPermission(BasePermission):
    def has_permission(self, request, view):
        if view.action != 'create':
            return True
        return validate_edit_header_presence(request)

    def has_object_permission(self, request, view, obj):
        return validate_edit_header(request, obj.plan_id)


class PlanPermission(BasePermission):
    def has_permission(self, request, view):
        if view.action == 'create':
            if not config.ALLOW_PLAN_CREATION:
                return False
            if not verify_captcha(request, get_captcha_response(request)):
                return False
        return True

    def has_object_permission(self, request, view, obj):
        return validate_edit_header(request, obj.id)
