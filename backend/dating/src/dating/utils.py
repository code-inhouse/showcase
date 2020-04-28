import json
import re
from random import randrange
from datetime import timedelta

from django.core.cache import cache
from django.utils.cache import patch_cache_control

import rules


def random_date(start, end):
    """
    This function will return a random datetime between two datetime
    objects.
    """
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = randrange(int_delta)
    return start + timedelta(seconds=random_second)


def composed(*decs):
    def deco(func):
        for dec in decs:
            func = dec(func)
        return func
    return deco


def build_predicate(config_field):
    from configurations.models import RulesConfig

    @rules.predicate
    def _predicate(user):
        config = RulesConfig.get_cached_config()
        profile = user.profile
        if config['is_free_for_women'] and profile.sex == 'female':
            return True
        return profile.status in config[config_field]

    return _predicate


def array_serializer(serialize):

    def func(objects):
        return {
            'items': [serialize(o) for o in objects]
        }

    return func


URL_REGEX = re.compile(
    '.*\.(?:com|net|org|info|coop|int'
    '|co\.uk|org\.uk|ac\.uk|uk)')

def moderate_links(text):
    words = text.split(' ')
    return ' '.join(
        '***' if URL_REGEX.findall(word) else word
        for word in words)



def build_status_predicate(allowed_statuses,
                           ignore_women_rules=False):

    @rules.predicate
    def _predicate(user):
        from configurations.models import RulesConfig
        config = RulesConfig.get_cached_config()
        profile = user.profile
        if not ignore_women_rules:
            pred = (profile.sex == 'female' and
                    config['is_free_for_women'])
        else:
            pred = False
        return (
            pred or
            profile.status in allowed_statuses or
            profile.status == 'moderator'
        )

    return _predicate


def make_true_predicate():
    @rules.predicate
    def _predicate(user):
        return True
    return _predicate


def disable_browser_cache(response):
    patch_cache_control(
        response,
        no_cache=True,
        max_age=0,
        must_revalidate=True,
        no_store=True
    )
    return response
