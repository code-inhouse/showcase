from django.forms import ModelForm


from .models import PaymentClick, PaymentTry, PaymentCreation


class PaymentClickForm(ModelForm):
    class Meta:
        model = PaymentClick
        fields = ['button', 'page_url', 'source']


class PaymentTryForm(ModelForm):
    class Meta:
        model = PaymentTry
        fields = ['subscription_type', 'price']



class PaymentCreationForm(ModelForm):
    class Meta:
        model = PaymentCreation
        fields = [
            'subscription_type',
            'price',
            'mobile',
            'phone',
            'currency'
        ]
