from django.utils.translation import ugettext_lazy as _

SEXS = (
    ('male', _('Мужчина')),
    ('female', _('Женщина'))
)

LOOKING_FOR = (
    ('male', _('Мужчину')),
    ('female', _('Женщину')),
)

MIN_AGE = 18
MAX_AGE = 100

PURPOSES = (
    ('long_term', _('Серьёзные отношения')),
    ('short_term', _('Быстрые отношения')),
    ('new_friends', _('Новые знакомства'))
)

MIN_HEIGHT = 100
MAX_HEIGHT = 250

BUILDS = (
    ('thin', _('Худощавое')),
    ('average', _('Среднее')),
    ('sport', _('Спортивное')),
    ('fat', _('Полноватое'))
)

ALCOHOL_ATTITUDES = (
    ('no_drink', _('Не употребляю')),
    ('company', _('Только в компании')),
    ('rarely', _('Изредка пью')),
    ('often', _('Пью часто'))
)

SMOKING_ATTITUDES = (
    ('negative', _('Негативное')),
    ('rarely', _('Курю редко')),
    ('often', _('Курю часто'))
)

STATUSES = (
    ('ordinary', 'Ordinary'),
    ('premium', 'Premium'),
    ('vip', 'VIP'),
    ('moderator', 'Moderator')
)
