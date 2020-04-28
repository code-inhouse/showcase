import uuid
import os

from PIL import Image

from django.db import models
from django.conf import settings
from django.core.files.images import ImageFile


class PhotoQuerySet(models.query.QuerySet):
    def active(self):
        return self.filter(is_deleted=False, from_post=False)


class PhotoManager(models.Manager):
    use_for_related_fields = True

    def get_queryset(self):
        return PhotoQuerySet(self.model)

    def active(self, *args, **kwargs):
        return self.get_queryset().active(*args, **kwargs)


class Photo(models.Model):

    def generate_path(self, filename):
        """
        Generates random path for saving files.
        Due to Linux filesystem there must not be a lot of files in one folder.
        """
        extension = self._get_extension(filename)
        rnd_str = str(uuid.uuid4())
        return '{}/{}/{}.{}'.format(rnd_str[:3], rnd_str[3:5],
                                    rnd_str[5:], extension)

    @classmethod
    def _get_extension(cls, filename):
        return filename.split('.')[-1]

    @classmethod
    def get_media_path(cls, filename):
        return '{}/{}'.format(settings.MEDIA_ROOT, filename)

    @classmethod
    def _resize(cls, image, size):
        image.thumbnail(size, Image.ANTIALIAS)
        return image

    def resize(self, path, size=(1280, 720)):
        image = Image.open(path)
        self._resize(image, size).save(path)

    def save(self, *args, **kwargs):
        """
        Resizes image to 720p on save
        """
        super(Photo, self).save(*args, **kwargs)
        self.resize(self.image.path)

    def natural_key(self):
        """
        Used for serialization
        """
        return self.thumbnail_url

    def set_as_avatar(self):
        """
        Sets image as avatar of related profile
        """
        self.profile.avatar = self
        self.profile.save()

    def add_small_thumbnail(self, save=False):
        if not self.thumbnail:
            raise ValueError('This photo does not have thumbnail')
        image = Image.open(self.thumbnail.path)
        fake_filename = (
            'abc.' + self._get_extension(self.thumbnail.path)
        )
        filename = self.get_media_path(
            self.generate_path(fake_filename)
        )
        new_img = self._resize(image, (100, 100))
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        open(os.path.abspath(filename), 'w').close()
        new_img.save(filename)
        small_thumb = ImageFile(open(filename, 'rb'))
        self.small_thumbnail.save(filename, small_thumb)
        os.remove(filename)
        if save:
            self.save()

    @property
    def small_thumbnail_url(self):
        if not self.small_thumbnail:
            return self.thumbnail_url
        return self.small_thumbnail.url

    def add_thumbnail(self, top, left, width, height, save=False):
        image = Image.open(self.image.path)
        orig_width, orig_height = image.size
        box = (
            int(left * orig_width),
            int(top * orig_height),
            int((left + width) * orig_width),
            int((top + height) * orig_height),
        )
        ava = image.crop(box)
        _, extension = os.path.splitext(self.image.name)
        path = self.get_media_path(
            str(uuid.uuid4()) + '.' + extension)
        ava.save(path)
        saved_thumbnail = ImageFile(open(path, 'rb'))
        self.thumbnail.save(path, saved_thumbnail)
        os.remove(path)
        self.add_small_thumbnail(save=save)
        if save:
            self.save()

    @property
    def is_avatar(self):
        return self.profile.avatar == self

    @property
    def thumbnail_url(self):
        if self.thumbnail:
            return self.thumbnail.url
        if self.image:
            return self.image.url
        return None

    def clone(self):
        photo = Photo.objects.get(pk=self.pk)
        photo.pk = None
        return photo

    image = models.ImageField(upload_to=generate_path)
    thumbnail = models.ImageField(null=True, blank=True,
                                  upload_to=generate_path)
    verified = models.BooleanField(default=True)
    profile = models.ForeignKey('DateProfile', related_name='photos')
    created = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    from_post = models.BooleanField(default=False)
    small_thumbnail = models.ImageField(
        null=True,
        blank=True,
        upload_to=generate_path
    )
    is_moderated = models.BooleanField(default=False)

    objects = PhotoManager()
