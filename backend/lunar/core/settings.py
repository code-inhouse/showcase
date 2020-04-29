import os

from split_settings.tools import optional, include


APP_ENV = os.getenv('APP_ENV', 'dev')

include(
    'components/base.py',
    'components/database.py',
    'components/static.py',
    'components/auth.py',
    f'environments/{APP_ENV}.py',
)
