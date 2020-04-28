import json

from django import template
from django.core.cache import cache
from django.conf import settings

from dateprofile.models import DateProfile as DP


register = template.Library()

CACHE_PREFIX = 'ACHIEVEMENTS_'


@register.assignment_tag(takes_context=True)
def top_profiles(context):
    req = context['request']
    profile = req.user.profile
    lang = req.session.get('_language', 'ru')
    cached_key = CACHE_PREFIX + lang + profile.looking_for
    cached = cache.get(cached_key)
    if cached:
        return cached
    profiles = (
        DP
        .objects
        .filter(sex=profile.looking_for)
        .order_by('-rating', 'is_fake', '-created')
    )
    jsoned = json.dumps([{
        'id': p.pk,
        'thumbnailUrl': p.thumbnail_url,
        'name': p.name,
        'rating': p.rating,
        'rank': p.rank
    } for p in profiles[:3]])
    cache.set(cached_key, jsoned, 3600)  # one hour
    return jsoned
