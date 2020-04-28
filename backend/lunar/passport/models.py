import uuid

from django.contrib.auth.models import User
from django.db import models


class EmailConfirmation(models.Model):
    KIND_REGISTRATION = 'REGISTRATION'
    KIND_RECOVERY = 'RECOVERY'
    KINDS = (
        (KIND_REGISTRATION, KIND_REGISTRATION,),
        (KIND_RECOVERY, KIND_RECOVERY,)
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    kind = models.CharField(choices=KINDS, max_length=20,
                            default=KIND_REGISTRATION)
    token = models.UUIDField(default=uuid.uuid4)
    used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def use(self):
        self.used = True
        self.save()
