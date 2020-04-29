from django.apps import AppConfig

import rules

from . import rules as dp_rules


class DateprofileConfig(AppConfig):
    name = 'dateprofile'

    def ready(self):
        rules.add_perm('no_vip_banner', dp_rules.no_vip_banner())
        rules.add_perm('no_prem_banner',
                       dp_rules.no_prem_banner())
        rules.add_perm('no_lottery_banner',
                       dp_rules.no_lottery_banner())
        rules.add_perm('no_emul_banner',
                       dp_rules.no_emul_banner())
        rules.add_perm('change_name', dp_rules.can_change_name)
        rules.add_perm('set_invisibility',
                       dp_rules.can_set_invisibility)
        rules.add_perm('first_in_messages',
                       dp_rules.be_first_in_messages)
        rules.add_perm('see_big_photos',
                       dp_rules.can_see_big_photos)
