from django.db import models


class Visit(models.Model):
    visitor = models.ForeignKey('DateProfile', related_name='visits')
    visited = models.ForeignKey('DateProfile', related_name='visitors')
    created = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    notified = models.BooleanField(default=False)

    def pseudo_delete(self, profile):
        if profile == self.visited:
            self.is_deleted = True
        self.save()

    class Meta:
        unique_together = ('visitor', 'visited',)

    def __str__(self):
        return '{} visited {}'.format(self.visitor.name, self.visited.name)


class VisitJournal(models.Model):
    visitor = models.ForeignKey('DateProfile',
                                related_name='visits_journal')
    visited = models.ForeignKey('DateProfile',
                                related_name='visitors_journal')
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '{} visited {}'.format(
            self.visitor.user.email,
            self.visited.user.email
        )
