import functools

from django import forms
from django.db import transaction

from dating.utils import moderate_links
from dateprofile.models import DateProfile as DP, Photo

from .models import Post


class PostForm(forms.Form):
    text = forms.CharField(required=False)

    def __init__(self, *args, **kwargs):
        max_photos = kwargs.pop('max_photos')
        self.max_photos = max_photos
        super().__init__(*args, **kwargs)
        for i in range(1, max_photos+1):
            self.fields['photo'+str(i)] = (
                forms.ImageField(required=False)
            )

    def clean(self, *args, **kwargs):
        cleaned_data = super().clean(*args, **kwargs)
        text = cleaned_data.get('text')
        if text:
            cleaned_data['text'] = moderate_links(text)
        return cleaned_data


    def is_valid(self, *args, **kwargs):
        valid = super().is_valid(*args, **kwargs)
        photos_uploaded = functools.reduce(
            lambda acc, photo: acc or (photo is not None),
            self.photos,
            False
        )
        if (not self.cleaned_data['text']) and (not photos_uploaded):
            valid = False
            self.add_error(
                None,
                'Either text or photos must be uploaded'
            )
        return valid

    @property
    def photos(self):
        for i in range(1, self.max_photos+1):
            photo = self.cleaned_data['photo'+str(i)]
            if photo:
                yield photo

    def save(self, profile):
        with transaction.atomic():
            post = Post(text=self.cleaned_data['text'],
                        profile=profile)
            post.save()
            for photo in self.photos:
                post.photos.add(Photo.objects.create(
                    image=photo,
                    profile=profile,
                    from_post=True
                ))
        return post
