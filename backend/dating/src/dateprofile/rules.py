import rules

from dating.utils import (
    build_status_predicate,
    make_true_predicate
)


def no_vip_banner():
    from configurations.models import BannersConfig

    @rules.predicate
    def _no_vip_banner(user):
        conf = BannersConfig.cached()
        return (
            not conf['show_vip'] or
            user.profile.status == 'vip'
        )
    return _no_vip_banner


def no_prem_banner():
    from configurations.models import BannersConfig

    @rules.predicate
    def _no_prem_banner(user):
        conf = BannersConfig.cached()
        return (
            not conf['show_premium'] or
            user.profile.status == 'vip' or
            user.profile.status == 'premium'
        )
    return _no_prem_banner


def no_emul_banner():
    from configurations.models import BannersConfig

    @rules.predicate
    def _no_emul_banner(user):
        conf = BannersConfig.cached()
        return (
            not conf['show_emulation'] or
            user.profile.can_emulate
        )
    return _no_emul_banner


def no_lottery_banner():
    from configurations.models import BannersConfig

    @rules.predicate
    def _no_lottery_banner(user):
        return not BannersConfig.cached()['show_lottery']
    return _no_lottery_banner


@rules.predicate
def ab_test(user):
    from configurations.models import RulesConfig
    config = RulesConfig.get_cached_config()
    if config['is_free_for_women'] and user.profile.sex == 'female':
        return True
    return user.profile.pk % 2 == 0



can_change_name = build_status_predicate(['premium', 'vip'], True)
can_set_invisibility = build_status_predicate(['premium', 'vip'], True)
be_first_in_messages = build_status_predicate(['vip'], True)
can_see_big_photos = make_true_predicate()
