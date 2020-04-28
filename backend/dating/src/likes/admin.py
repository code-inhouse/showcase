from django.contrib import admin

from reversion.admin import VersionAdmin

from . import models


@admin.register(models.Like)
class LikeAdmin(VersionAdmin):
    readonly_fields = ('created',)


@admin.register(models.Dislike)
class DislikeAdmin(admin.ModelAdmin):
    readonly_fields = ('created',)
