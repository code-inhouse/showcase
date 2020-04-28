from django.http import JsonResponse

from dateprofile.decorators import profile_required


@profile_required
def task(req):
    profile = req.user.profile
    task = profile.task
    user_data = {
        'userRating': profile.rating,
        'userRank': str(profile.rank)
    }
    if task:
        user_data.update({
            'id': task.pk,
            'description': task.description,
            'longDescription': task.long_description,
            'name': task.name,
            'award': task.award
        })
        return JsonResponse(user_data)
    user_data.update({'id': -1})
    return JsonResponse(user_data)
