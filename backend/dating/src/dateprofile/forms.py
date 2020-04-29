import hashlib
from functools import reduce

from PIL import Image

from django import forms
from django.contrib.auth.models import User
from django.conf import settings

from allauth.socialaccount.forms import (
    SignupForm as AllauthSocialSignupForm
)
from activities.tasks import start_emulation

from achievements.models import AvatarAchievement

from ipware.ip import get_real_ip

from .models import DateProfile, Photo, Answer, QuestionnaireAnswer
from .models.dateprofile import constants as dp_constants



class QuestionnaireForm(forms.ModelForm):
    birthday = forms.DateField(required=True, input_formats=['%Y-%m-%d'])
    class Meta:
        model = DateProfile
        fields = [
            'sex',
            'looking_for',
            'name',
            'birthday',
            'lower_age_bound',
            'upper_age_bound',
            'purpose',
            'height',
            'build',
            'alcohol_attitude',
            'smoking_attitude'
        ]


class PhotoForm(forms.ModelForm):
    is_avatar = forms.BooleanField(required=False, initial=False)

    class Meta:
        model = Photo
        fields = ['image']


class AvatarForm(forms.Form):
    rel_top = forms.FloatField()
    rel_left = forms.FloatField()
    rel_width = forms.FloatField()
    rel_height = forms.FloatField()
    image = forms.ImageField(required=False)
    image_url = forms.URLField(required=False)

    def is_valid(self, *args, **kwargs):
        valid = super().is_valid(*args, **kwargs)
        if valid:
            image = self.cleaned_data['image']
            image_url = self.cleaned_data['image_url']
            return not (image == None and image_url == '')
        return valid


class AnswerForm(forms.ModelForm):
    class Meta:
        model = Answer
        fields = ['text']


class LookingForForm(forms.ModelForm):
    class Meta:
        model = DateProfile
        fields = ['looking_for', 'lower_age_bound',
                  'upper_age_bound', 'purpose']


class CharacterForm(forms.ModelForm):
    class Meta:
        model = DateProfile
        fields = ['alcohol_attitude', 'smoking_attitude', 'build']

    def __init__(self, *args, **kwargs):
        super(CharacterForm, self).__init__(*args, **kwargs)
        for field_key in self.fields:
            field = self.fields[field_key]
            field.choices = field.choices[1:]


class ChangeEmailForm(forms.Form):
    secret = forms.CharField(max_length='60')
    new_email = forms.EmailField()
    user = forms.ModelChoiceField(queryset=User.objects.all())

    def is_valid(self, *args, **kwargs):
        valid = super(ChangeEmailForm, self).is_valid(*args, **kwargs)
        if not valid:
            return valid
        user = self.cleaned_data['user']
        m = hashlib.md5()
        m.update((settings.SECRET_KEY + str(user.pk)).encode('utf-8'))
        return m.hexdigest() == self.cleaned_data['secret']


class QuestionnaireAnswerForm(forms.ModelForm):
    class Meta:
        model = QuestionnaireAnswer
        fields = '__all__'


class DateProfileFormMixin:
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.dateprofile_fields = [
            'sex',
            'looking_for',
            'name',
            'birthday',
            'lower_age_bound',
            'upper_age_bound',
            'purpose',
            'build',
            'alcohol_attitude',
            'smoking_attitude'
        ]
        self.fields['sex'] = forms.ChoiceField(
            choices=dp_constants.SEXS)
        self.fields['looking_for'] = forms.ChoiceField(
            choices=dp_constants.LOOKING_FOR)
        self.fields['name'] = forms.CharField(
            max_length=50)
        self.fields['birthday'] = forms.DateField()
        self.fields['lower_age_bound'] = forms.IntegerField(
            min_value=dp_constants.MIN_AGE,
            max_value=dp_constants.MAX_AGE)
        self.fields['upper_age_bound'] = forms.IntegerField(
            min_value=dp_constants.MIN_AGE,
            max_value=dp_constants.MAX_AGE)
        self.fields['purpose'] = forms.ChoiceField(
            choices=dp_constants.PURPOSES)
        self.fields['build'] = forms.ChoiceField(
            choices=dp_constants.BUILDS)
        self.fields['alcohol_attitude'] = forms.ChoiceField(
            choices=dp_constants.ALCOHOL_ATTITUDES)
        self.fields['smoking_attitude'] = forms.ChoiceField(
            choices=dp_constants.SMOKING_ATTITUDES)


class SocialSignupForm(DateProfileFormMixin, AllauthSocialSignupForm):
    rel_top = forms.FloatField(required=False)
    rel_left = forms.FloatField(required=False)
    rel_width = forms.FloatField(required=False)
    rel_height = forms.FloatField(required=False)
    image = forms.ImageField(required=False)
    image_url = forms.URLField(required=False)

    def is_valid(self, *args, **kwargs):
        valid = super().is_valid(*args, **kwargs)
        if not valid:
            return valid
        if (self.cleaned_data['image'] or
            self.cleaned_data['image_url']):
            rel_names = ['rel_top', 'rel_left', 'rel_width', 'rel_height']
            if not reduce(
                lambda x, name: (
                    x and bool(self.cleaned_data[name])),
                rel_names,
                True):
                return False
            is_y_valid = self.cleaned_data['rel_top'] + self.cleaned_data['rel_height'] < 1.1
            is_x_valid = self.cleaned_data['rel_left'] + self.cleaned_data['rel_width'] < 1.1
            return is_x_valid and is_y_valid
        return True

    def custom_signup(self, req, user):
        from .views import _add_avatar
        dateprofile_kwargs = dict(
            (k, self.cleaned_data[k])
            for k in self.dateprofile_fields)
        dateprofile_kwargs['user'] = user
        profile = DateProfile(**dateprofile_kwargs)
        profile.task = AvatarAchievement.objects.create()
        ip = get_real_ip(req)
        if ip:
            profile.ip = ip
        profile.save()
        _add_avatar(req.POST, req.FILES, profile)
        profile.send_welcome_msg()
        if profile.avatar:
            start_emulation(profile)



