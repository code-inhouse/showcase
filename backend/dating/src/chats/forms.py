from django import forms

from .models import Message


class MessageForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = [
            'body',
            'sender',
            'chat'
        ]

    def is_valid(self, *args, **kwargs):
        res = super().is_valid(*args, **kwargs)
        if not res:
            return res
        chat = self.cleaned_data['chat']
        sender = self.cleaned_data['sender']
        if chat.profile2 != sender and chat.profile1 != sender:
            return False
        receiver = (
            chat.profile1
            if sender == chat.profile2
            else chat.profile2
        )
        if not sender.user.has_perm('send_message_to', receiver):
            return False
        return True

    def save(self, *args, **kwargs):
        need_to_commit = kwargs.get('commit', True)
        kwargs['commit'] = False
        instance = super().save(*args, **kwargs)
        receiver = (instance.chat.profile1
                    if instance.chat.profile2 == instance.sender
                    else instance.chat.profile2)
        instance.receiver = receiver
        if need_to_commit:
            instance.save()
        return instance
