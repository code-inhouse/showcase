from django import forms
from django.db.models import Q
from django.contrib.auth.models import User


class RegisterForm(forms.Form):
    name = forms.CharField()
    email = forms.CharField()
    password = forms.CharField()

    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(Q(username=email) | Q(email=email)).exists():
            raise forms.ValidationError('Email is taken')
        return email


class RequestRecoveryForm(forms.Form):
    email = forms.EmailField()


class NewPasswordForm(forms.Form):
    token = forms.CharField()
    new_password = forms.CharField()


class UpdatePersonalDataForm(forms.Form):
    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    phone_number = forms.CharField(required=False)


class UpdateSocialDataForm(forms.Form):
    facebook = forms.CharField(required=False)
    twitter = forms.CharField(required=False)
    linkedin = forms.CharField(required=False)
