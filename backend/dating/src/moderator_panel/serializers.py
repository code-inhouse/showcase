def serialize_profile(profile):
    return {
        'name': profile.name,
        'id': profile.pk,
        'avatar': profile.thumbnail_url
    }


def serialize_photo(photo):
    return {
        'id': photo.pk,
        'src': photo.image.url,
        'profile': serialize_profile(photo.profile)
    }


def serialize_message(msg):
    return {
        'type': 'message',
        'id': msg.pk,
        'profile': serialize_profile(msg.sender),
        'created': msg.sent,
        'body': msg.body
    }


def serialize_feedback(feedback):
    return {
        'type': 'feedback',
        'id': feedback.pk,
        'profile': serialize_profile(feedback.profile),
        'created': feedback.created,
        'body': feedback.text
    }

