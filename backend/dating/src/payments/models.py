from django.db import models


class PaymentClick(models.Model):
    BUTTONS = (
        ('vip', 'vip'),
        ('premium', 'premium'),
    )
    profile = models.ForeignKey('dateprofile.DateProfile')
    source = models.CharField(max_length=200,
                              blank=True,
                              null=True)
    button = models.CharField(choices=BUTTONS, max_length=20)
    page_url = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'pay_click'


class PaymentTry(models.Model):
    TYPES = (
        ('vip', 'vip'),
        ('premium', 'premium'),
    )
    profile = models.ForeignKey('dateprofile.DateProfile')
    subscription_type = models.CharField(choices=TYPES,
                                         max_length=20)
    price = models.FloatField()
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'pay_try'


class PaymentCreation(models.Model):
    TYPES = (
        ('vip', 'vip'),
        ('premium', 'premium'),
    )
    profile = models.ForeignKey('dateprofile.DateProfile')
    subscription_type = models.CharField(choices=TYPES,
                                         max_length=20)
    price = models.FloatField()
    mobile = models.BooleanField(default=False)
    phone = models.CharField(null=True,
                             blank=True,
                             max_length=100)
    currency = models.CharField(blank=True,
                                max_length=100,
                                null=True,
                                default='')
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'pay_created'
