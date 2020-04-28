from django.db import models, transaction


class Post(models.Model):
    CHOICES = (
        ('regular', 'Regular'),
        ('add_photo', 'Add photo'),
        ('answer_question', 'Answer question')
    )
    text = models.CharField(max_length=1000, blank=True)
    profile = models.ForeignKey(
        'dateprofile.DateProfile',
        related_name='posts',
        blank=False
    )
    photos = models.ManyToManyField(
        'dateprofile.Photo',
        related_name='posts',
    )
    is_deleted = models.BooleanField(default=False)
    post_type = models.CharField(max_length=30,
                                 choices=CHOICES,
                                 default='regular')
    created = models.DateTimeField(auto_now_add=True)

    @property
    def photo_urls(self):
        for photo in self.photos.all():
            yield photo.image.url

    @classmethod
    def create_photo_post(cls, photo):
        post_photo = photo.clone()
        post_photo.from_post = True
        with transaction.atomic():
            post_photo.save()
            post = cls.objects.create(profile=photo.profile,
                                      post_type='add_photo')
            post.save()
            post.photos.add(post_photo)
        return post

    @classmethod
    def create_answer_post(cls, answer):
        """
        Creates a post based on an answer;
        Post's text is a question and an answer separated by
        double semicolon
        """
        post_text = '%s;;%s' % (answer.question.text, answer.text)
        post = Post(profile=answer.profile,
                    text=post_text,
                    post_type='answer_question')
        post.save()
        return post
