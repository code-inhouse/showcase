from dating.utils import array_serializer


class LookingForSerializer(object):

    @staticmethod
    def serialize(profile):
        return {
            'lookingFor': {
                'sex': profile.looking_for,
                'age': {
                    'from': profile.lower_age_bound,
                    'to': profile.upper_age_bound
                },
            },
            'purpose': profile.purpose
        }


class CharacterSerializer(object):

    @staticmethod
    def serialize(profile):
        return {
            'bodyType': profile.build,
            'attitudes': {
                'smoking': profile.smoking_attitude,
                'alcohol': profile.alcohol_attitude
            }
        }


class AvatarSerializer(object):

    @staticmethod
    def serialize(photo):
        return {
            'id': photo.pk,
            'url': photo.image.url,
            'deleted': photo.is_deleted,
            'isAvatar': True,
            'thumbnailUrl': photo.thumbnail_url,
            'smallThumbnailUrl': photo.small_thumbnail_url
        }


def serialize_visit(visit):
    return {
        'id': visit.pk,
        'visitor_id': visit.visitor.id,
        'visitor_avatar': visit.visitor.thumbnail_url,
        'visitor_name': visit.visitor.name,
        'visitor_sex': visit.visitor.sex,
        'created': visit.created
    }

serialize_visits = array_serializer(serialize_visit)
