from __future__ import absolute_import, division, print_function, unicode_literals

import json
import logging

import requests

from django.conf import settings
from django.core.cache import cache

from constance import config


logger = logging.getLogger(__name__)

VERIFICATION_URL = 'https://www.google.com/recaptcha/api/siteverify'

CAPTCHA_RESPONSE_KEY = 'g-recaptcha-response'


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[-1].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    logger.error(ip)
    return ip


def _get_attempts_key(ip_addr):
    return ip_addr


def _get_login_attempts(ip_addr):
    key = _get_attempts_key(ip_addr)
    attempts = cache.get(key)
    if attempts:
        return int(attempts)
    return 0


def get_captcha_response(request):
    return json.loads(request.body).get(CAPTCHA_RESPONSE_KEY)


def can_login_without_captcha(login_attempts):
    return login_attempts < config.ATTEMPTS_BEFORE_CAPTCHA


def should_show_captcha(request):
    ip_addr = get_client_ip(request)
    attempts = _get_login_attempts(ip_addr)
    return not can_login_without_captcha(attempts)


def incr_attempts(request):
    ip_addr = get_client_ip(request)
    key = _get_attempts_key(ip_addr)
    timeout = 60 * 60 * 2
    attempts = cache.get(key) or 0
    logger.error(f'{key} {attempts}')
    cache.set(key, attempts + 1, timeout)


def reset_login_attempts(request):
    ip_addr = get_client_ip(request)
    key = _get_attempts_key(ip_addr)
    cache.delete(key)


def verify_captcha_response(captcha_response):
    # docs link: https://developers.google.com/recaptcha/docs/verify

    # Response format:
    # {
    #     "success": true|false,
    #     "challenge_ts": timestamp,  // timestamp of the challenge load
    #                                 // (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
    #     "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
    #     "error-codes": [...]        // optional
    # }

    # Error codes:
    # missing-input-secret	    The secret parameter is missing.
    # invalid-input-secret	    The secret parameter is invalid or malformed.
    # missing-input-response	The response parameter is missing.
    # invalid-input-response	The response parameter is invalid or malformed.
    # bad-request   	        The request is invalid or malformed.

    try:
        response = requests.post(VERIFICATION_URL, data={
            'secret': settings.RECAPTCHA_SERVER_KEY,
            'response': captcha_response
        }, timeout=2)
        if not response.ok:
            return False
        data = response.json()
        if data['success']:
            return True
        return False
    except Exception:  # noqa
        return False


def verify_captcha(request, captcha_response):
    with_captcha = should_show_captcha(request)
    if not with_captcha:
        return True
    if with_captcha:
        if not captcha_response:
            return False
        if not verify_captcha_response(captcha_response):
            return False
    return True
