from django.http import HttpResponse


def method_restriction(*allowed_methods):

    message = 'Only {} {} allowed.'.format(
        ', '.join(allowed_methods),
        'methods are' if len(allowed_methods) > 1 else 'method is')

    def wrap(f):

        def wrapped(req, *args, **kwargs):
            if req.method not in allowed_methods:
                return HttpResponse(message, status=405)
            return f(req, *args, **kwargs)

        return wrapped

    return wrap
