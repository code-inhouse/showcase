from django.http import HttpResponse

from dating.decorators import method_restriction
from dateprofile.decorators import profile_required
from achievements.dispatcher import dispatch

from .forms import FeedbackForm


@method_restriction('POST')
@profile_required
def send_feedback(req):
    form = FeedbackForm(req.POST)
    if form.is_valid():
        feedback = form.save(commit=False)
        feedback.profile = req.user.profile
        feedback.save()
        dispatch('WRITE_FEEDBACK', req.user.profile)
        return HttpResponse('ok')
    return HttpResponse(str(form.errors), status=400)
