import os


APP_MODE = os.getenv('APP_MODE', 'dev')

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'g7#4pe_z@*68e+l+$yy^0c0@a1p#9sv4&-k@k$%^r&u2c(ah#i'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'constance',
    'constance.backends.database',
    'webpack_loader',
    'django_filters',
    'rest_framework',
    'cities_light',

    'events',
    'recaptcha',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
]

if APP_MODE == 'prod':
    MIDDLEWARE.append('whitenoise.middleware.WhiteNoiseMiddleware')

MIDDLEWARE += [
    'core.middleware.redirect_middleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'calendar',
        'USER': os.getenv('DB_USER', 'kilmiashkin'),
        'HOST': 'localhost',
        'PORT': 5432,
    }
}

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'core-cache',
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',  # noqa
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',  # noqa
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',  # noqa
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',  # noqa
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'assets')]

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'dist/'
    }
}

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',  # noqa
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'PAGE_SIZE': 10,
}


CONSTANCE_CONFIG = {
    'ALLOW_PLAN_CREATION': (True, 'Allow plan creation'),
    'ATTEMPTS_BEFORE_CAPTCHA': (2, 'Attempts before captcha check')
}

CONSTANCE_BACKEND = 'constance.backends.database.DatabaseBackend'

RECAPTCHA_CLIENT_KEY = os.getenv('RECAPTCHA_CLIENT_KEY', '6LcMEKMUAAAAAGRIWVz9Do2C3uFa73xVQo6y-sQq')
RECAPTCHA_SERVER_KEY = os.getenv('RECAPTCHA_SERVER_KEY', '6LcMEKMUAAAAAC3XM8IjV5d_DpQbUykujCdvFfBu')

WHITENOISE_ROOT = os.path.join(BASE_DIR, 'root_static')

if APP_MODE == 'stage':
    from .settings_stage import *  # noqa
elif APP_MODE == 'prod':
    from .settings_prod import *  # noqa
