from dating.utils import (
    build_predicate,
    build_status_predicate
)
from dateprofile.rules import ab_test


can_see_visits = lambda: build_predicate('can_see_visits')
can_see_likes = lambda: build_predicate('can_see_likes')


have_no_likes_restriction = (
    ab_test |
    build_status_predicate(['premium', 'vip'])
)
