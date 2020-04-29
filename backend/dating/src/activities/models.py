from django.db import models


TYPES = (
    ('like', 'Лайк'),
    ('visit', 'Визит'),
    ('message', 'Сообщение'),
)


class Contact(models.Model):
    emulator = models.ForeignKey('dateprofile.DateProfile',
                                 related_name='contacts')
    contacted = models.ForeignKey('dateprofile.DateProfile',
                                  related_name='emulations')
    type = models.CharField(max_length=10, choices=TYPES)
    created = models.DateTimeField(auto_now_add=True)


class ContactJournal(models.Model):
    emulator = models.ForeignKey('dateprofile.DateProfile',
                                 related_name='journal_contacts')
    contacted = models.ForeignKey('dateprofile.DateProfile',
                                  related_name='journal_emulations')
    type = models.CharField(max_length=10, choices=TYPES)
    created = models.DateTimeField(auto_now_add=True)
