import os

from .base import *

# os.environ['DJANGO_SETTINGS_MODULE'] = 'dating.settings.prod'
ROOT_URLCONF = 'dating.urls'


DEBUG = False
ALLOWED_HOSTS = ['naidisebe.com']
STATIC_ROOT = os.path.join(BASE_DIR, '..', 'static')
STATICFILES_DIRS = []


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_HOST_USER = 'potatoden'
EMAIL_HOST_PASSWORD = 'cheburek404'
EMAIL_PORT = 587
EMAIL_USE_TLS = True

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'timestamp': {
            'format': '[%(asctime)s] %(message)s'
        }
    },
    'handlers': {
        # Include the default Django email handler for errors
        # This is what you'd get without configuring logging at all.
        'mail_admins': {
            'class': 'django.utils.log.AdminEmailHandler',
            'level': 'ERROR',
             # But the emails are plain text by default - HTML is nicer
            'include_html': True,
        },
        # Log to a text file that can be rotated by logrotate
        'logfile': {
            'class': 'logging.handlers.WatchedFileHandler',
            'filename': '/var/log/dating/log.log'
        },
        'email': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/var/log/dating/email.log',
            'formatter': 'timestamp'
        }
    },
    'loggers': {
        # Again, default Django configuration to email unhandled exceptions
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        # Might as well log any errors anywhere else in Django
        'django': {
            'handlers': ['logfile'],
            'level': 'ERROR',
            'propagate': False,
        },
        'email': {
            'handlers': ['email'],
            'level': 'INFO',
            'propagate': True
        }
    },
}

DOMAIN = 'http://naidisebe.com'

USE_ANALYTICS = True

SITE_ID = 1
