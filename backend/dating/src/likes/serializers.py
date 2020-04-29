from dating.utils import array_serializer

def serialize_like(like):
    return {
        'id': like.pk,
        'liker_id': like.liker.id,
        'liker_avatar': like.liker.thumbnail_url,
        'liker_name': like.liker.name,
        'liker_sex': like.liker.sex,
        'liker_birthday': like.liker.birthday,
        'created': like.created
    }

def serialize_my_like(profile, like):
    return {
        'id': like.pk,
        'liked_id': like.liked.id,
        'liked_avatar': like.liked.thumbnail_url,
        'liked_name': like.liked.name,
        'liked_sex': like.liked.sex,
        'liked_birthday': like.liked.birthday,
        'created': like.created,
        'canSendMessage': (
            profile.user.has_perm('send_message_to', like.liked)
        )
    }

serialize_likes = array_serializer(serialize_like)

def serialize_my_likes(profile, likes):
    return {
        'items': [serialize_my_like(profile, l) for l in likes]
    }
