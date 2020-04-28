# coding: utf-8

import json

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.db.models import Q
from django.db.models.fields import DateField
from django.db.models.functions import Cast
from django.utils.translation import ugettext as _

from dating.decorators import method_restriction
from dateprofile.decorators import profile_required
from dateprofile.models import DateProfile as DP
from achievements.dispatcher import dispatch

from .models import Post
from .forms import PostForm
from .serializers import serialize_posts


def try_str_to_int(val):
    try:
        return int(val)
    except (ValueError, TypeError):
        return None


@profile_required
def index(req):
    completed_task = dispatch('VISIT_NEWS', req.user.profile)
    return render(req, 'news/index.html', {
        'title': _('Новости'),
        'active': 'news',
        'completed_task': completed_task
    })


@profile_required
@method_restriction('POST')
def create(req):
    MAX_PHOTOS = 5
    form = PostForm(req.POST, req.FILES, max_photos=MAX_PHOTOS)
    if form.is_valid():
        post = form.save(req.user.profile)
        if post.photos.count() > 0 and post.text:
            dispatch('ADD_POST', req.user.profile, post=post)
        return JsonResponse({
            'id': post.pk,
            'photos': list(map(
                lambda photo: photo.image.url,
                post.photos.all()
            ))
        })
    return HttpResponse(str(form.errors), status=400)


@profile_required
@method_restriction('POST')
def delete(req, post_id):
    post = Post.objects.get(pk=post_id)
    if post.profile == req.user.profile:
        post.is_deleted = True
        post.save()
        return HttpResponse('ok')
    return HttpResponse('You are not the owner of the post to delete',
                        status=400)


@profile_required
def posts(req):
    POSTS_PER_FETCH = 30
    newer_than = try_str_to_int(
        req.GET.get('newer_than', None)
    )
    older_than = try_str_to_int(
        req.GET.get('older_than', None)
    )
    only_user_posts = req.GET.get('pid', None)
    if newer_than:
        query = Q(pk__gt=newer_than)
        prefix = ''
    elif older_than:
        query = Q(pk__lt=older_than)
        prefix = '-'
    else:
        query = Q()
        prefix = '-'
    if only_user_posts:
        pid = try_str_to_int(only_user_posts)
        profile = get_object_or_404(DP, pk=pid)
        posts = (
            Post.objects
            .filter(profile=profile, is_deleted=False)
            .select_related('profile')
            .prefetch_related('photos')
        )
    else:
        posts = req.user.profile.matching_posts
    ordering = [
        prefix + 'created_date',
        '-is_user_vip',
        prefix + 'created'
    ]
    posts = (
        posts
        .filter(query)
        .annotate(created_date=Cast('created', DateField()))
        .annotate(
            is_user_vip=DP.is_vip_annotation('profile__status'))
        .order_by(*ordering)
        [:POSTS_PER_FETCH]
    )
    return JsonResponse({'posts': serialize_posts(posts)})
