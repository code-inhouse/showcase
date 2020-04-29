from django.contrib import admin

from .models import Plan

class PlanAdmin(admin.ModelAdmin):
    readonly_fields = ['city', 'parent_plan']

admin.site.register(Plan, PlanAdmin)
