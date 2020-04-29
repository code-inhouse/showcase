from django.conf import settings


def use_analytics(req):
    if settings.USE_ANALYTICS:
        return {
            'USE_ANALYTICS': True
        }
    return {}
