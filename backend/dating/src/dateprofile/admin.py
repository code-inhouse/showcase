from django.contrib import admin

from . import models


@admin.register(models.DateProfile)
class DateProfileAdmin(admin.ModelAdmin):
    list_display = ('get_email', 'name', 'status')
    readonly_fields = ('last_seen', '_city')
    search_fields = ['user__email', 'id']

    def get_email(self, obj):
        return obj.user.email

    get_email.short_description = 'email'
    get_email.admin_order_field = 'user__email'


@admin.register(models.Question)
class QuestionAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Answer)
class AnswerAdmin(admin.ModelAdmin):
   list_display = ('profile', 'question', 'text')


@admin.register(models.Photo)
class PhotoAdmin(admin.ModelAdmin):
   list_display = ('profile', 'verified')


@admin.register(models.Visit)
class VisitAdmin(admin.ModelAdmin):
    pass
