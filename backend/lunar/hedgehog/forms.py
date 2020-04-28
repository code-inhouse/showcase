from django import forms


class InsertAuthDataForm(forms.Form):
    iv = forms.CharField()
    cipher_text = forms.CharField()
    lookup_key = forms.CharField()


class CreateUserForm(forms.Form):
    username = forms.CharField()
    address = forms.CharField()
