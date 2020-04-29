from django.apps import AppConfig

import rules

from . import rules as like_rules


class LikesConfig(AppConfig):
    name = 'likes'

    def ready(self):
        rules.add_perm('see_visits', like_rules.can_see_visits())
        rules.add_perm('see_likes', like_rules.can_see_likes())
        rules.add_perm('no_likes_restriction',
                       like_rules.have_no_likes_restriction)
