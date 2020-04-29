from django import forms

from .models import Like, Dislike


class LikeForm(forms.ModelForm):
    class Meta:
        model = Like
        fields = ['liker', 'liked']


class DislikeForm(forms.ModelForm):
    class Meta:
        model = Dislike
        fields = ['disliker', 'disliked']
