from .models import EmailTracking


def email_tracking_middleware(get_response):

    def middleware(request):
        save = request.GET.get('email', '').lower() == 'true'
        if save:
            try:
                profile = request.user.profile
            except AttributeError:
                profile = None
            EmailTracking.objects.create(
                profile=profile,
                url=request.build_absolute_uri())
        response = get_response(request)

        return response

    return middleware
