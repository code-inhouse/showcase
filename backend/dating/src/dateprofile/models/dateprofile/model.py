from datetime import datetime
import itertools
import uuid
import logging
import random

from geoip2.errors import AddressNotFoundError

from django.db import models
from django.db.models import Q, Case, Value, When, F, BooleanField
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils.translation import ugettext as _

from dateutil.relativedelta import relativedelta

from allauth.account.models import EmailAddress

from dating import geoip
from chats.models import Chat, Message
from ..visit import Visit
from likes.models import Like, Dislike
from activities.models import Contact
from configurations.models import DefaultActivityConfig, ActivityConfig
from news.models import Post

from ..ip import City
from .constants import *


logger = logging.getLogger(__name__)


def generate_chat_token():
    return str(uuid.uuid4())


def random_in_queryset(qs):
    length = len(qs)
    if length == 0:
        raise IndexError
    return qs[random.randrange(0, length)]


class DateProfile(models.Model):

    user = models.OneToOneField(User, related_name='profile')
    sex = models.CharField(max_length=6, choices=SEXS)
    looking_for = models.CharField(
        max_length=6,
        choices=LOOKING_FOR,
        blank=False)
    name = models.CharField(max_length=50, blank=False)
    birthday = models.DateField(blank=False)
    lower_age_bound = models.IntegerField(validators=[
        MinValueValidator(MIN_AGE), MaxValueValidator(MAX_AGE)
    ], blank=False)
    upper_age_bound = models.IntegerField(validators=[
        MinValueValidator(MIN_AGE), MaxValueValidator(MAX_AGE)
    ], blank=False)
    purpose = models.CharField(max_length=30, choices=PURPOSES, blank=False)
    height = models.IntegerField(validators=[
        MinValueValidator(MIN_HEIGHT, MAX_HEIGHT)
    ], blank=True, null=True)  # deprecated
    build = models.CharField(max_length=30, choices=BUILDS, blank=False)
    alcohol_attitude = models.CharField(max_length=30,
                                        choices=ALCOHOL_ATTITUDES,
                                        blank=False)
    smoking_attitude = models.CharField(max_length=30,
                                        choices=SMOKING_ATTITUDES,
                                        blank=False)
    avatar = models.ForeignKey('Photo', null=True, blank=True)
    status = models.CharField(max_length=30,
                               choices=STATUSES,
                               default='ordinary',
                               blank=False)
    # once account is verified it will stay verified till eternity passes away
    # we need to denormalize db slightly in order not to do requests each time
    # we want to check if an account is verified
    _verified = models.BooleanField(default=False)
    ip = models.CharField(null=True, blank=True, max_length=50)
    created = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField(auto_now_add=True)
    chat_token = models.CharField(max_length=50, default=generate_chat_token)
    _city = models.ForeignKey(City, related_name='profiles', null=True)
    _real_city = models.BooleanField(default=True)
    is_fake = models.BooleanField(default=False)
    can_emulate = models.BooleanField(default=False)
    email_subscribed = models.BooleanField(default=True)
    task_model = models.ForeignKey(ContentType,
                                   on_delete=models.CASCADE,
                                   null=True)
    task_id = models.PositiveIntegerField(null=True)
    task = GenericForeignKey('task_model', 'task_id')
    rating = models.IntegerField(default=0)
    invisible = models.BooleanField(default=False)
    is_support = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)

    @property
    def verified(self):
        """
        Checks whether the account is verified
        """
        if self._verified:
            return True
        if self.user.is_authenticated:
            try:
                EmailAddress.objects.filter(email=self.user.email,
                                            verified=True)
                self._verified = True
                self.save()
                return True
            except ObjectDoesNotExist:
                pass
        return False

    @property
    def age(self):
        """
        Returns profile's age
        """
        return relativedelta(datetime.now(), self.birthday).years

    @property
    def match_query(self):
        today = datetime.today()
        EXTENSION = 3
        lower_bday = (
            today -
            relativedelta(years=self.lower_age_bound-EXTENSION)
        )
        upper_bday = (
            today - relativedelta(years=self.upper_age_bound+EXTENSION)
        )
        return (Q(birthday__gte=upper_bday) &
                Q(birthday__lte=lower_bday) &
                Q(sex=self.looking_for) &
                ~Q(pk=self.pk) &
                Q(is_deleted=False))


    @property
    def ordered_matches(self):
        lat, long = self.city.latitude, self.city.longtitude
        distance = ((F('_city__latitude')-lat) ** 2 +
                    (F('_city__longtitude')-long) ** 2)
        return (
            self.matches
            .filter(~Q(avatar=None))
            .select_related('avatar')
            .annotate(distance=distance)
            .order_by('is_fake', '-last_seen', 'distance')
        )

    @property
    def matches(self):
        """
        Returns profiles that match profile's age settings
        """
        seen = set(itertools.chain(
            Like.objects.filter(liker=self).values_list('liked', flat=True),
            Dislike.objects.filter(disliker=self).values_list('disliked', flat=True)))
        matches_filter = (
            self.match_query &
            ~Q(pk__in=seen) &
            ~Q(status='moderator')
        )
        liked_me = (
            Like.objects
            .filter(liked=self)
            .values_list('liker__pk', flat=True)
        )
        return (
            DateProfile.objects
            .filter(matches_filter)
            .annotate(liked_me=Case(
                When(pk__in=liked_me, then=Value(True)),
                default=Value(False),
                output_field=models.BooleanField()
            ))
        )

    @property
    def chats(self):
        return Chat.objects.filter(Q(profile1=self) | Q(profile2=self))

    @property
    def mutual(self):
        liked_me = set(
            Like.objects
            .filter(liked=self)
            .values_list('liker', flat=True)
        )
        i_liked = (
            Like.objects
            .filter(liker=self, liked__in=liked_me, mutual_viewed=False)
            # .select_related('liked', 'liked__avatar')
        )
        return i_liked

    def get_city(self):
        DEFAULT_CITY, _ = City.objects.get_or_create(
            country='Russia',
            longtitude=37.6184,
            latitude=55.7485,
            name_en='Moscow',
            name=''
        )
        if not self.ip:
            return DEFAULT_CITY
        try:
            city = geoip.city(self.ip)
            return City.objects.get_or_create(
                country=city['country_name'],
                name_en=city['city'],
                latitude=city['latitude'],
                longtitude=city['longitude'],
                name=''
            )[0]
        except AddressNotFoundError:
            self._real_city = False
            return DEFAULT_CITY

    @property
    def city(self):
        """
        Returns city where user lives identified by ip
        or default city
        """
        if self._city:
            return self._city
        return self.get_city()

    @property
    def country(self):
        return self.city.country

    @city.setter
    def set_city(self, value):
        self._city = value

    def emulation_queue(self, exclude_fake=False):
        emulated = (
            Contact.objects
            .filter(contacted=self)
            .values_list('emulator', flat=True)
        )
        query = Q(can_emulate=True)
        if not exclude_fake:
            query = query | Q(is_fake=True)
        else:
            query = query & Q(is_fake=False)
        emulators = (
            DateProfile.objects
            .filter(~Q(pk__in=emulated) &
                    self.match_query &
                    query)
        )
        return emulators

    def get_emulator(self):
        try:
            emulator = random_in_queryset(
                self.emulation_queue(True)
            )
        except IndexError:
            Contact.objects.filter(contacted=self).delete()
            try:
                emulator = random_in_queryset(
                    self.emulation_queue()
                )
            except IndexError:
                return None
        return emulator

    def update_chat_token(self):
        self.chat_token = generate_chat_token()
        self.save()

    def save(self, *args, **kwargs):
        if not self._city:
            self._city = self.city
        super().save(*args, **kwargs)

    @property
    def activity_config(self):
        age = self.age
        try:
            activity = (
                ActivityConfig.objects
                .filter(Q(age_from__gte=age) &
                        Q(age_to__lt=age) &
                        (Q(sex=self.sex) | Q(sex=None)))
                [0]
            )
        except IndexError:
            activity = DefaultActivityConfig.get_solo()
        return activity

    @property
    def unread_likes(self):
        return Like.objects.filter(liked=self, notified=False)

    @property
    def unread_visits(self):
        return Visit.objects.filter(visited=self,
                                    notified=False,
                                    is_deleted=False)

    @property
    def unread_messages(self):
        return Message.objects.filter(receiver=self, is_read=False)

    @property
    def thumbnail_url(self):
        if self.avatar:
            return self.avatar.thumbnail_url
        return None

    @property
    def matching_posts(self):
        matches = (
            DateProfile.objects
            .filter(self.match_query)
            .values_list('pk', flat=True)
        )
        return Post.objects.filter(
            Q(profile__pk__in=matches) &
            Q(is_deleted=False)
        ).select_related('profile').prefetch_related('photos')

    @property
    def matching_support(self):
        supports = (
            DateProfile.objects
            .filter(status='moderator', is_support=True)
        )
        try:
            q_sex = 'male' if self.sex == 'female' else 'female'
            sex_supports = supports.filter(sex=q_sex)
            if len(sex_supports) > 0:
                return sex_supports[0]
            return supports[0]
        except IndexError:
            return None

    @property
    def matching_admin(self):
        q_sex = 'male' if self.sex == 'female' else 'female'
        try:
            return (
                DateProfile.objects
                .filter(sex=q_sex,
                        status='moderator',
                        is_fake=False)
                [0]
            )
        except IndexError:
            return None

    @property
    def is_invisible(self):
        return self.invisible and self.status in ['premium', 'vip']

    def is_first_in_messages(self):
        # speedup for rules 'first_in_messages'
        return self.status == 'vip'

    def send_emulation_info_msg(self):
        message = (
            'Привет, {name}. Теперь вы получите больше ответного внимания '
            'и шансы найти партнера заметно увеличились. '
            'Это отличное решение! С вашего разрешения, мы будем отправлять '
            'от вас симпатии самым подходящим людям в течении этой недели. '
            'Результат не заставит себя ждать.'
        )
        try:
            admin = self.matching_admin
            chat = Chat.get_chat(self, admin)
            Message.objects.create(
                sender=admin,
                receiver=self,
                chat=chat,
                body=message.format(name=self.name))
        except ObjectDoesNotExist:
            msg = '''
                Could not send emulation info message to id=%s.
                Did not find an appropriate sender.
            '''
            logging.error(msg % self.pk)

    def send_welcome_msg(self):
        message = (
            '{name}, рады видеть Вас на NaidiSebe.com! Мы сделали сайт чтобы Вы могли легко найти вторую половинку для серьезных отношений или просто новых друзей.\n\n'
            'Не знаете с чего начать? Это просто - справа есть меню для перехода между разделами:\n\n'
            '"Моя страница" - так Вас видят другие пользователи сайта. Добавляйте больше фотографий, расскажите о себе и ответьте на вопросы - смелее, это увеличит интерес противоположного пола! Также тут можно поменять цель знакомства или возраст партнера, который Вы указывали при регистрации\n\n'
            '"Найти пару" - оценивайте людей по фотографии, нажимая кнопку нравится или не нравится. Люди узнают только о хорошей оценке. Если симпатия взаимная - вы оба узнаете об этом! Тогда смело начинайте разговор, вас уже ждут :)\n\n'
            '"Сообщения" - здесь удобно переписываться с другими людьми. Тут же хранится переписка на сайте.\n\n'
            '"Новости" - узнайте, что произошло нового у людей, которые вам интересны. Напишите свою новость и её прочитают другие гости сайта.\n\n'
            '"Симпатии" - тут сохраняются странички людей, которым Вы поставили "Мне нравится". Смотрите, кто оценивал вас и заходил на вашу страницу.\n\n'
            'Будьте активнее и смелее, ведь здесь все ищут любовь и новые знакомства.\n\n'
            'Пишите мне по любым вопросам. Удачи!'
        )
        try:
            admin = self.matching_admin
            chat = Chat.get_chat(self, admin)
            Message.objects.create(
                sender=admin,
                receiver=self,
                chat=chat,
                body=message.format(name=self.name))
        except ObjectDoesNotExist:
            msg = '''
                Could not send welcome message to id=%s.
                Did not find an appropriate sender.
            '''
            logging.error(msg % self.pk)

    @property
    def is_admin(self):
        return self.status == 'moderator'

    @property
    def rank(self):
        if self.rating < 10:
            return _('Незнакомец')
        if self.rating < 30:
            return _('Новичок')
        if self.rating < 40:
            return _('Гость')
        if self.rating < 50:
            return _('Местный')
        if self.rating < 60:
            return _('Ученик')
        if self.rating < 70:
            return _('Опытный')
        if self.rating < 80:
            return _('Знаток')
        if self.rating < 90:
            return _('Советник')
        if self.rating < 100:
            return _('Мастер')
        return _('Элита')

    @classmethod
    def is_vip_annotation(cls, status_field_name='status'):
        kwargs = {
            'then': True
        }
        kwargs[status_field_name] = 'vip'
        return Case(
            When(**kwargs),
            default=False,
            output_field=BooleanField()
        )

    def may_purchase(self, subscription_type):
        if self.status == 'vip':
            return False
        if self.status == 'premium':
            return subscription_type in ['vip']
        return True

    def __str__(self):
        return '{email} {name}'.format(name=self.name, email=self.user.email)


class SessionJournal(models.Model):
    profile = models.ForeignKey('DateProfile',
                                related_name='sessions_journal')
    start = models.DateTimeField()
    end = models.DateTimeField()
