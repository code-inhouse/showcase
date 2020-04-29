from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.postgres.fields import ArrayField
from django.utils.translation import ugettext as _

from chats.models import Message
from dateprofile.models import Visit, Answer, Photo
from feedbacks.models import Feedback
from likes.models import Like


DEFAULT_AWARD = 10


class Achievement(models.Model):
    created = models.DateTimeField(auto_now_add=True)

    @property
    def long_description(self):
        raise NotImplementedError

    @property
    def description(self):
        raise NotImplementedError

    @property
    def name(self):
        raise NotImplementedError

    @property
    def award(self):
        return DEFAULT_AWARD

    @classmethod
    def get_award(cls):
        return DEFAULT_AWARD

    @classmethod
    def is_completed(cls, profile):
        return False

    @classmethod
    def create(cls, profile):
        if cls == Achievement:
            raise NotImplementedError
        return cls.objects.create()

    class Meta:
        abstract = True


class AvatarAchievement(Achievement):
    @property
    def name(self):
        return _('Загрузить аватар')

    @property
    def long_description(self):
        return _(
            'Ай-яй-яй, у тебя нет фотографии! Вряд ли '
            'кто-то захочет общаться с незнакомцем. Нажми '
            '“Изменить фото” '
            'на своей странице и загрузи своё любимое фото'
        )

    @property
    def description(self):
        return _(
            'Загрузите свою фотографию '
            'Для этого нажмите “Изменить фото” на своей странице'
        )

    @classmethod
    def is_completed(cls, profile):
        return profile.avatar != None


class VisitAchievement(Achievement):
    @property
    def name(self):
        return _('Перейти на чужую страницу')

    @property
    def long_description(self):
        return _(
            'Кто-то ходит в гости по утрам, а мы в '
            'любое время. На нашем сайте можно зайти '
            'в гости к любому человеку, просто нажав '
            'на его фото. Вы увидите его страницу, '
            'фотографии и заметки. Попробуйте!'
        )

    @property
    def description(self):
        return _(
            'Зайдите на страницу другого человека '
            'Для этого нажмите на его/её фотографию'
        )

    @classmethod
    def is_completed(cls, profile):
        return Visit.objects.filter(visitor=profile).count() > 0


class LikeAchievement(Achievement):
    DEFAULT_NEED_TO_LIKE = 10

    liked = models.IntegerField(default=0)
    need_to_like = models.IntegerField(
        default=DEFAULT_NEED_TO_LIKE)

    @property
    def name(self):
        return _('Лайкнуть 10 человек')

    @property
    def long_description(self):
        return _(
            'Пора начать охоту! Поставь лайк (“нравится”) '
            '10 людям, которые тебе нравятся. '
            'Для этого нажимайте на кнопку с '
            'сердцем под фотографией человека в '
            'разделе “Найти пару”'
        )

    @property
    def description(self):
        return _(
            'Поставь лайк 10 людям '
            'Для этого жми кнопку с сердечком в “Найти пару”'
        )

    @classmethod
    def is_completed(cls, profile):
        likes_count = Like.objects.filter(liker=profile).count()
        return likes_count >= cls.DEFAULT_NEED_TO_LIKE

    @classmethod
    def create(cls, profile):
        likes_count = Like.objects.filter(liker=profile).count()
        return cls.objects.create(liked=likes_count)


class QuestionAchievement(Achievement):
    DEFAULT_NEED_TO_ANSWER = 3

    questions = ArrayField(
        models.IntegerField(blank=False, null=False),
        default=list
    )
    need_to_answer = models.IntegerField(
        default=DEFAULT_NEED_TO_ANSWER)

    @property
    def name(self):
        return _('Ответить на 3 вопроса в профиле')

    @property
    def long_description(self):
        return _(
            'Люди хотят знать больше о вас, '
            'расскажите! Для этого на своей '
            'странице справа нажмите “Показать больше вопросов” '
            'и ответьте на 3 любых вопроса'
        )

    @property
    def description(self):
        return _(
            'Расскажите больше о себе '
            'Ответьте на 3 вопроса на своей странице'
        )

    @classmethod
    def is_completed(cls, profile):
        answered = Answer.objects.filter(profile=profile).count()
        return answered >= cls.DEFAULT_NEED_TO_ANSWER

    @classmethod
    def create(cls, profile):
        questions = (
            Answer.objects
            .filter(profile=profile)
            .values_list('question', flat=True)
        )
        return cls.objects.create(questions=list(questions))


class PhotoAchievement(Achievement):
    DEFAULT_NEED_TO_UPLOAD = 2

    uploaded = models.IntegerField(default=0)
    need_to_upload = models.IntegerField(
        default=DEFAULT_NEED_TO_UPLOAD)

    @property
    def name(self):
        return _('Загрузить 2 дополнительных фото в альбом')

    @property
    def long_description(self):
        return _(
            'Больше фото - больше шанс понравиться '
            'другим. Можешь загрузить сколько '
            'угодно фотографий в альбом на своей странице. '
            'Можно начать с двух фото.'
        )

    @property
    def description(self):
        return _(
            'Загрузи ещё 2 своих фото в альбом '
            'Для этого нажми “Загрузить” в '
            'разделе “Мои фото” на своей странице'
        )

    @classmethod
    def get_photo_count(cls, profile):
        return (
            Photo.objects
            .filter(is_deleted=False, profile=profile)
            .count()
        )

    @classmethod
    def is_completed(cls, profile):
        return (
            cls.get_photo_count(profile) >
            cls.DEFAULT_NEED_TO_UPLOAD
        )

    @classmethod
    def create(cls, profile):
        return (
            cls.objects
            .create(uploaded=cls.get_photo_count(profile))
        )


class NewsfeedAchievement(Achievement):
    @property
    def name(self):
        return _('Посмотреть страницу новостей')

    @property
    def long_description(self):
        return _(
            'На нашем сайте много людей, они все '
            'тоже что-то рассказывают о себе. '
            'Зайди в раздел “Новости”, посмотри. '
            'Так же противоположный пол видит твои обновления.'
        )

    @property
    def description(self):
        return _(
            'Узнай, что нового у подходящих тебе людей '
            'Для этого нажми “Новости” в меню слева '
        )


class NewsPostAchievement(Achievement):
    @property
    def name(self):
        return _('Сделать пост с текстом и фото')

    @property
    def long_description(self):
        return _(
            'Пришло время и нам рассказать о своей жизни. '
            'Создай заметку с текстом и фотографией, '
            'пускай увидят все! Для этого введи текст '
            'на своей странице, где написано “Что нового?” '
            'и прикрепи к тексту фото'
        )

    @property
    def description(self):
        return _(
            'Поделись своими новостями с другими '
            'На своей странице напиши свои мысли '
            'под надписью “Что нового?” и прикрепи '
            'подходящее фото'
        )

    @classmethod
    def is_completed(cls, profile):
        posts = profile.posts.all()
        for post in posts:
            if post.photos.count() > 0 and post.text:
                return True
        return False


class MessageAchievement(Achievement):
    DEFAULT_NEED_TO_CHAT = 5

    chats = ArrayField(
        models.IntegerField(blank=False, null=False),
        default=list
    )
    need_to_chat = models.IntegerField(
        default=DEFAULT_NEED_TO_CHAT)

    @property
    def name(self):
        return _('Написать 5 сообщений разным людям')

    @property
    def long_description(self):
        return _(
            'Теперь твоя страница готова, можно смело '
            'писать другим людям. Начни разговор '
            'с 5 новыми людьми, которые тебе нравятся. '
            'Начни с  чего-то интереснее, чем просто '
            '“привет” ;)'
        )

    @property
    def description(self):
        return _(
            'Напиши 5 новым людям '
            'Для этого жми “Отправить сообщение” '
            'рядом с фото человека'
        )

    @classmethod
    def _get_chats(cls, profile):
        return (
            Message.objects
            .filter(sender=profile)
            .values_list('chat__pk', flat=True)
            .distinct()
        )

    @classmethod
    def is_completed(cls, profile):
        return (
            cls._get_chats(profile).count() >=
            cls.DEFAULT_NEED_TO_CHAT
        )

    @classmethod
    def create(cls, profile):
        return cls.objects.create(
            chats=list(cls._get_chats(profile)))


class FeedbackAchievement(Achievement):
    @property
    def name(self):
        return _('Написать отзыв/предложение в Поддержку')

    @property
    def long_description(self):
        return _(
            'Мы надеемся, что тебе нравится наш сайт. '
            'Тогда подскажи, как нам сделать его ещё лучше. '
            'Для этого нажми в правом верхнем углу кнопку '
            '“Помощь” и напиши свои пожелания и предложения'
        )

    @property
    def description(self):
        return _(
            'Помоги нам сделать сайт лучше '
            'Для это напиши свои предложения, '
            'нажав кнопку “Помощь” в верхнем углу'
        )

    @classmethod
    def is_completed(cls, profile):
        return (
            Feedback.objects
            .filter(profile=profile)
            .count()
        ) > 0


class ActivityAchievement(Achievement):
    days_to_pass = models.IntegerField(default=5)

    @property
    def name(self):
        return _('Провести на сайте 5 дней')

    @property
    def long_description(self):
        return _(
            'Спасибо за отзыв, мы обязательно его учтем '
            'и станем лучше! Последнее задание самое легкое. '
            'Продолжай заходить на наш сайт, общаться и через '
            '5 дней ты получишь 100% рейтинг. Желаем удачи и '
            'много новых знакомств! '
            'P.S. скоро будут новые задания ;)'
        )

    @property
    def description(self):
        return _(
            'Наслаждайся общением и знакомствами каждый день. '
            'Через 5 дней твой рейтинг станет 100%'
        )


class SympathiesAchievement(Achievement):
    @property
    def name(self):
        return _('Посмотреть страницу симпатий')

    @property
    def long_description(self):
        return _(
            'У нас есть раздел Симпатии. '
            'Тут мы сохраняем тех, кто тебе нравится. '
            'Также тут можно увидеть и своих поклонников.'
        )

    @property
    def description(self):
        return _(
            'Посмотри своих любимчиков и поклонников! '
            'Для этого нажми “Симпатии” в меню слева'
        )


class AchievementJournal(models.Model):
    profile = models.ForeignKey('dateprofile.DateProfile')
    task_id = models.IntegerField(null=False, blank=False)
    task_name = models.TextField(null=False, blank=False)
    started = models.DateTimeField(null=False, blank=False)
    finished = models.DateTimeField(auto_now_add=True)
