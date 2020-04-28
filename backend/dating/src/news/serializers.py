from dating.utils import array_serializer

def serialize_post(post):
    profile = post.profile
    return {
        'id': post.pk,
        'profile': {
            'id': profile.pk,
            'name': profile.name,
            'thumbnail': (
                profile.avatar.small_thumbnail_url
                if profile.avatar
                else None
            ),
            'sex': profile.sex,
            'isAdmin': profile.is_admin,
            'status': profile.status,
            'firstInNews': profile.user.has_perm('first_in_news')
        },
        'text': post.text,
        'photos': list(post.photo_urls),
        'created': post.created,
        'type': post.post_type
    }

serialize_posts = array_serializer(serialize_post)
