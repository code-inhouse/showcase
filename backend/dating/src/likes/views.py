from datetime import datetime, date
import itertools

from dateutil.relativedelta import relativedelta

from django.http import HttpResponse, JsonResponse
from django.db.models import Q, F
from django.db.models.fields import DateField
from django.db.models.functions import Cast
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render, get_object_or_404
from django.utils.translation import ugettext as _

from reversion.views import create_revision

from dating.utils import disable_browser_cache
from dateprofile.models import DateProfile as DP, Visit
from dating.decorators import method_restriction
from dateprofile.decorators import profile_required
from achievements.dispatcher import dispatch
from configurations.models import RulesConfig

from .models import Like, Dislike
from .forms import LikeForm
from .serializers import serialize_likes, serialize_my_likes

from . import settings


@profile_required
@method_restriction('POST')
@create_revision()
def like(req, profile_id):
    profile = DP.objects.get(user=req.user)
    liked_profile = get_object_or_404(DP, pk=profile_id)
    try:
        Like.objects.get(liker=profile, liked=liked_profile)
        return HttpResponse('such like already exists', status=400)
    except ObjectDoesNotExist:
        like = Like(liker=profile, liked=liked_profile)
        like.save()
        dispatch('LIKE', profile, like=like)
        return JsonResponse({'id': like.id})


@profile_required
@method_restriction('POST')
@create_revision()
def unlike(req, profile_id):
    profile = DP.objects.get(user=req.user)
    liked_profile = get_object_or_404(DP, pk=profile_id)
    try:
        like = Like.objects.get(liker=profile, liked=liked_profile)
        like.delete()
    except ObjectDoesNotExist:
        return HttpResponse('such like does not exist', status=404)
    return HttpResponse('ok')


@profile_required
@method_restriction('POST')
def dislike(req, profile_id):
    profile = DP.objects.get(user=req.user)
    disliked_profile = get_object_or_404(DP, pk=profile_id)
    try:
        Dislike.objects.get(disliker=profile,
                            disliked=disliked_profile)
        return HttpResponse('such dislike already exists', status=400)
    except ObjectDoesNotExist:
        Dislike(disliker=profile, disliked=disliked_profile).save()
        return HttpResponse('ok')


@profile_required
def matches(req):
    profile = (
        DP.objects
        .select_related('_city')
        .prefetch_related('likes', 'dislikes')
        .prefetch_related('likes__liked', 'dislikes__disliked')
        .get(user=req.user)
    )
    lat, long = profile.city.latitude, profile.city.longtitude
    distance = ((F('_city__latitude')-lat) ** 2 +
                (F('_city__longtitude')-long) ** 2)
    matches = (
        profile.matches
        .filter(~Q(avatar=None))
        .select_related('avatar')
        .annotate(distance=distance)
        .annotate(is_vip=DP.is_vip_annotation())
        .annotate(last_seen_date=Cast('last_seen', DateField()))
        .order_by(
            'is_fake',
            '-last_seen_date',
            '-is_vip',
            '-last_seen',
            'distance')
        [:settings.MATCHES_PER_GAME]
    )
    jsoned = [{
        'pk': p.pk,
        'name': p.name,
        'birthday': p.birthday,
        'thumbnailUrl': (
            p.avatar.small_thumbnail_url
            if p.avatar
            else None
        ),
        'avatarUrl': p.avatar.image.url if p.avatar else None,
        'likedMe': p.liked_me,
        'status': p.status,
        'canSendMessage': req.user.has_perm('send_message_to', p)
    } for p in matches]
    return disable_browser_cache(JsonResponse({'matches': jsoned}))


@profile_required
def matches_page(req):
    profile = req.user.profile
    config = RulesConfig.get_cached_config()
    today = date.today()
    liked_today = (
        Like.objects
        .filter(liker=profile, created__gt=today)
        .count()
        +
        Dislike.objects
        .filter(disliker=profile, created__gt=today)
        .count()
    )
    return disable_browser_cache(
        render(req, 'likes/matches.html', {
            'active': 'like_game',
            'title': _('Найти пару'),
            'likes_per_day': config['likes_per_day'],
            'liked_today': liked_today
        }))


@profile_required
def info_page(req):
    completed_task = dispatch('VISIT_SYMPATHIES', req.user.profile)
    sympathies = (
        Like.objects
        .filter(liker=req.user.profile, liker_deleted=False)
        .select_related('liked', 'liked__avatar')
        .order_by('-created')
    )
    visits = (
        Visit.objects
        .filter(visited=req.user.profile, is_deleted=False)
        .select_related('visitor', 'visitor__avatar')
        .order_by('-created')
    )
    visits.update(notified=True)
    liked_me = (
        Like.objects
        .filter(liked=req.user.profile, liked_deleted=False)
        .select_related('liker', 'liker__avatar')
        .order_by('-created')
    )
    liked_me.update(notified=True)
    return render(req, 'likes/info.html', {
        'sympathies': sympathies,
        'visits': visits,
        'liked_me': liked_me,
        'active': 'sympathies',
        'title': _('Симпатии'),
        'completed_task': completed_task
    })


@profile_required
def unread_likes_count(req):
    profile = req.user.profile
    unread_likes_count = profile.unread_likes.count()
    try:
        last_like_id = profile.unread_likes.latest('created').pk
    except ObjectDoesNotExist:
        last_like_id = 0
    return JsonResponse({
        'count': unread_likes_count,
        'last_id': last_like_id
    })


@profile_required
def unread_likes(req):
    try:
        last_id = int(req.GET.get('last_id', 0))
    except ValueError:
        return HttpResponse('Could not parse last_id',status=400)
    if not last_id:
        unread_likes = (
            req.user.profile
            .unread_likes
            .select_related('liker', 'liker__avatar')
            [:50]
        )
    else:
        try:
            like = (
                Like.objects
                .filter(pk__gte=last_id,
                        liked=req.user.profile,
                        notified=False)
                .order_by('pk')
                [0]
            )
            unread_likes = (
                req.user.profile
                .unread_likes
                .filter(
                    Q(created__gt=like.created) |
                    (~Q(pk=last_id) & Q(created__gte=like.created))
                )
                .select_related('liker', 'liker__avatar')
            )
        except IndexError:
            unread_likes = []
    return JsonResponse(serialize_likes(unread_likes))


@profile_required
def mutual(req):
    last_id = int(req.GET.get('last_id', 0))
    profile = req.user.profile
    likes = (
        profile.mutual
        .filter(pk__gt=last_id)
        .select_related('liked', 'liked__avatar')
    )
    return JsonResponse(serialize_my_likes(profile, likes[:50]))


@profile_required
def mutual_count(req):
    profile = req.user.profile
    likes = profile.mutual.order_by('-pk')
    count = likes.count()
    return JsonResponse({
        'last_id': likes[0].id if count > 0 else 0,
        'count': count
    })


@method_restriction('POST')
@profile_required
def view_mutual(req, like_id):
    profile = req.user.profile
    like = get_object_or_404(Like, pk=like_id)
    if like.liker != profile:
        return HttpResponse('You cannot view not yours like',
                            status=403)
    like.mutual_viewed = True
    like.save()
    return HttpResponse('ok')


@profile_required
@method_restriction('POST')
@create_revision()
def delete_like(req, like_id):
    profile = req.user.profile
    like = get_object_or_404(Like, pk=int(like_id))
    try:
        like.pseudo_delete(profile)
    except ValueError:
        error = 'You do not have rights to delete this like'
        return HttpResponse(error, status=403)
    return HttpResponse('ok')
