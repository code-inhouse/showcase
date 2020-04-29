from django.apps import AppConfig

import rules

from . import rules as news_rules


class NewsConfig(AppConfig):
    name = 'news'

    def ready(self):
        rules.add_perm('first_in_news', news_rules.be_first_in_news)
