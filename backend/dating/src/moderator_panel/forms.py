from django import forms

from dateprofile.models import DateProfile as DP, Photo
from feedbacks.models import Feedback
from chats.models import Message

from .models import PhotoRejection


class ReplyForm(forms.Form):
    profile = forms.ModelChoiceField(queryset=DP.objects.all())
    body = forms.CharField(required=True, max_length=1000)


class MarkFeedbackForm(forms.Form):
    feedback = forms.ModelChoiceField(
        queryset=Feedback.objects.all())


class MarkMessageForm(forms.Form):
    message = forms.ModelChoiceField(
        queryset=Message.objects.all())


class PhotoRejectionForm(forms.ModelForm):
    class Meta:
        model = PhotoRejection
        fields = ['photo', 'reason']


class PhotoModerationForm(forms.Form):
    photo = forms.ModelChoiceField(queryset=Photo.objects.all())
