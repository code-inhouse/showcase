from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Contact, ContactJournal


@receiver(post_save, sender=Contact)
def journal(sender, instance, created, **kwargs):
    if created:
        ContactJournal.objects.create(
            emulator=instance.emulator,
            contacted=instance.contacted,
            type=instance.type
        )
