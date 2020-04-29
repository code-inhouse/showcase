from django.contrib import admin

from solo.admin import SingletonModelAdmin

from .models import (
    RulesConfig,
    DefaultActivityConfig,
    ActivityConfig,
    IntervalsConfig,
    BannersConfig
)

admin.site.register(RulesConfig, SingletonModelAdmin)
admin.site.register(DefaultActivityConfig, SingletonModelAdmin)
admin.site.register(IntervalsConfig, SingletonModelAdmin)
admin.site.register(BannersConfig, SingletonModelAdmin)
admin.site.register(ActivityConfig)
