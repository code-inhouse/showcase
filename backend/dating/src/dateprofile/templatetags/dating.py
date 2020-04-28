from django import template
from django.templatetags.static import static as _static
from django.utils.safestring import mark_safe
from django.conf import settings
from django.utils.safestring import mark_safe


register = template.Library()

with open(settings.STATIC_VERSION_PATH) as f:
  VERSION = f.readline()[:-1]


def should_i18n(path):
    if not 'compiled/' in path:
        return False
    try:
        query_param = path.index('?')
    except ValueError:
        query_param = len(path)
    real_path = path[:query_param]
    if real_path.endswith('js'):
        return True


@register.simple_tag(name='static', takes_context=True)
def static(context, path):
    lang = context['request'].session.get('_language', 'ru')
    res = ''
    if should_i18n(path):
        if lang != 'ru':
           real_path = path.split('?', 1)[0]
           decomposed = map(
             lambda x: lang + '.' + x if x == 'js' else x,
             real_path.split('/'))
           composed = '/'.join(decomposed)
           res = _static(composed)
    if not res:
      res = _static(path)
    return mark_safe(res + '?v={}'.format(VERSION))


@register.simple_tag(name='status_sign')
def status_sign(profile):
  if profile.status == 'vip':
    return mark_safe(
      '<img src="/static/images/vip_sign.png"'
      ' class="status-sign"/>')
  if profile.status == 'premium':
    return mark_safe(
      '<img src="/static/images/premium_sign.png"'
      ' class="status-sign"/>')
  return ''
