import json
import os
import urllib.request

from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.contrib.auth.models import User
from django.views import View
from django.contrib import messages
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.db.utils import IntegrityError
from django.http import HttpResponse, JsonResponse, Http404
from django import forms
from django.conf import settings
from django.core.files import File
from django.core.files.images import ImageFile
from django.utils.translation import ugettext as _

from allauth.account.views import signup as account_signup
from allauth.account.forms import SignupForm as AccountSignupForm
from allauth.account.models import EmailAddress
from allauth.socialaccount.views import SignupView as AllauthSocialSignupView
from rules.contrib.views import permission_required

from ipware.ip import get_real_ip

from dating.decorators import method_restriction

from likes.models import Like
from chats.models import Encourage
from news.models import Post
from activities.tasks import start_emulation
from achievements.dispatcher import dispatch
from achievements.models import AvatarAchievement

from .forms import (
    QuestionnaireForm,
    PhotoForm,
    AnswerForm,
    LookingForForm,
    CharacterForm,
    ChangeEmailForm,
    AvatarForm,
    QuestionnaireAnswerForm,
    SocialSignupForm)
from .models import (
    DateProfile as DP,
    Question,
    Photo,
    Answer,
    Visit,
    VisitJournal,
    RepostLog)
from . import serializers as srlzrs
from .serializers import serialize_visits
from .decorators import profile_required


def _add_avatar(post_data, files, profile):
    form = AvatarForm(post_data, files)
    if form.is_valid():
        image = form.cleaned_data['image']
        image_url = form.cleaned_data['image_url']
        if image:
            photo = Photo.objects.create(profile=profile,
                                         image=image)
        else:
            result = urllib.request.urlretrieve(image_url)
            photo = Photo(profile=profile)
            photo.image.save(
                'random.jpg',
                File(open(result[0], 'rb'))
            )
            photo.save()
            os.remove(result[0])
        photo.add_thumbnail(form.cleaned_data['rel_top'],
                            form.cleaned_data['rel_left'],
                            form.cleaned_data['rel_width'],
                            form.cleaned_data['rel_height'])
        photo.add_small_thumbnail()
        photo.save()
        profile.avatar = photo
        profile.save()
        Post.create_photo_post(photo)
        dispatch('ADD_AVATAR', profile)
        return photo
    return None


def index(req):
    if req.user.is_authenticated():
        return redirect(reverse('dateprofile:profile'))
    return redirect(reverse('account_signup'))


def terms(req):
    return render(req, 'dateprofile/terms_and_conditions.html', {})


def terms_en(req):
    return render(req, 'dateprofile/terms_and_conditions_en.html', {})


def conf_policy(req):
    return render(req, 'dateprofile/conf_policy.html', {})


def conf_policy_en(req):
    return render(req, 'dateprofile/conf_policy_en.html', {})


def about(req):
    return render(req, 'dateprofile/about.html', {})


def contacts(req):
    return render(req, 'dateprofile/contacts.html', {})


def signup_from_repost(req, repost_source):
    if req.method == 'GET':
        return signup(req)
    else:
        res = signup(req)
        if res.status_code < 400:
            RepostLog.objects.create(repost_source=repost_source)
        return res


class Signup(View):
    """
    View for handling signup
    """

    @classmethod
    def inject_context_data(cls, res):
        questionnaire_form = QuestionnaireForm()
        res.context_data['questionnaire_form'] = questionnaire_form
        res.context_data['photo_form'] = AvatarForm()
        res.context_data['answer_form'] = AnswerForm()
        return res

    def get(self, req):
        res = account_signup(req)
        if res.status_code == 302:  # user is logged in
            return res
        self.inject_context_data(res)
        return render(req, 'dateprofile/signup.html', res.context_data)

    def post(self, req):
        self.questionnaire_form = QuestionnaireForm(req.POST)
        if self.questionnaire_form.is_valid():
            res = account_signup(req)

            if res.status_code == 200:  # success
                profile = self._create_profile(req.POST['email'].strip(),
                                               get_real_ip(req))
                if not profile:
                    return redirect(reverse('dateprofile:account_signup'))
                _add_avatar(req.POST, req.FILES, profile)
                self._add_answers(req.POST, profile)
                self.add_questionnaire_answers(req, profile)
                return res

            res.context_data['questionnaire_form'] = self.questionnaire_form
            return render(req, 'dateprofile/signup.html', res.context_data)
        return self._invalid_questionnaire(req)

    def add_questionnaire_answers(self, req, profile):
        for i in range(10):
            question = req.POST.get(
                'form-dummy-question-{}'.format(i + 1),
                None)
            answer = req.POST.get(
                'form-dummy-question-answer-{}'.format(i + 1),
                None)
            if (not question) or (not answer):
                continue
            form = QuestionnaireAnswerForm({
                'profile': profile.pk,
                'question': question,
                'answer': answer
            })
            if form.is_valid():
                form.save(commit=True)

    def _create_profile(self, email, ip=None):
        profile = self.questionnaire_form.save(commit=False)
        profile.user = User.objects.get(email=email)
        profile.task = AvatarAchievement.objects.create()
        if ip:
            profile.ip = ip
        try:
            profile.save()
        except IntegrityError:
            return None
        return profile

    @staticmethod
    def _add_answers(post_data, profile):
        for key in post_data:
            if key.startswith('answer-'):
                question_pk = key[len('answer-'):]
                try:
                    question = Question.objects.get(pk=question_pk)
                except ObjectDoesNotExist:
                    continue
                form = AnswerForm({'text': post_data[key]})
                if form.is_valid():
                    answer = form.save(commit=False)
                    answer.profile = profile
                    answer.question = question
                    answer.save()

    def _invalid_questionnaire(self, req):
        req.method = 'GET'  # very dirty hacking
        res = account_signup(req)
        form = AccountSignupForm(req.POST)
        form.is_valid()
        res.context_data['form'] = form
        res.context_data['questionnaire_form'] = self.questionnaire_form
        return redirect(reverse('dateprofile:account_signup'))


signup = Signup.as_view()


@profile_required
def profile(req, profile_id=None):
    """
    View for profile page
    """
    profile_id = int(profile_id) if profile_id else req.user.profile.id
    try:
        profile = (
            DP.objects
              .prefetch_related('photos')
              .prefetch_related('answers')
              .prefetch_related('answers__question')
              .select_related('avatar')
              .get(pk=profile_id)
        )
    except ObjectDoesNotExist:
        raise Http404
    context = {
        'profile': profile,
        'own': profile.id == req.user.profile.id,
        'can_see_big_photos': req.user.has_perm('see_big_photos')
    }
    if context['own']:
        answered = []
        for answer in profile.answers.all():
            answered.append(answer.question.pk)
        query = ~Q(pk__in=answered)
        unanswered_questions = Question.objects.filter(query).all()
        context['questions'] = unanswered_questions
        context['looking_for_form'] = LookingForForm(instance=profile)
        context['char_form'] = CharacterForm(instance=profile)
        context['answer_form'] = AnswerForm()
        context['photo_form'] = PhotoForm()
        context['active'] = 'my_profile'
        context['title'] = _('Моя страница')
    else:
        context['encouraged'] = (
            Encourage.objects
            .filter(encourager=req.user.profile, encouraged=profile)
            .exists()
        )
        if not req.user.profile.is_invisible:
            Visit.objects.get_or_create(visitor=req.user.profile,
                                        visited=profile)
        VisitJournal.objects.create(visitor=req.user.profile,
                                    visited=profile)
        context['completed_task'] = dispatch('VISIT',
                                             req.user.profile)
        try:
            Like.objects.get(liker=req.user.profile, liked=profile)
            context['liked'] = True
        except ObjectDoesNotExist:
            context['liked'] = False
    return render(req, 'dateprofile/profile.html', context)


@profile_required
def update_search(req):
    """
    View for updating profile's search settings
    """
    profile = get_object_or_404(DP, user=req.user)
    form = LookingForForm(req.POST, instance=profile)
    if form.is_valid():
        profile = form.save(commit=True)
        return JsonResponse(srlzrs.LookingForSerializer.serialize(profile))
    return HttpResponse('fail, {}'.format(form.errors), status=400)


@profile_required
def update_character(req):
    """
    View for updating profile's character settings
    """
    profile = get_object_or_404(DP, user=req.user)
    form = CharacterForm(req.POST, instance=profile)
    if form.is_valid():
        profile = form.save(commit=True)
        return JsonResponse(srlzrs.CharacterSerializer.serialize(profile))
    return HttpResponse('fail, {}'.format(form.errors), status=400)


class ProfileSetting(object):
    """
    Generates views for dateprofile settings changes.
    """

    def __init__(self, attr):

        class _Form(forms.ModelForm):
            class Meta:
                model = DP
                fields = [attr]

        self.attr = attr
        self.form = _Form

    def get_data(self, req_data):
        return req_data[self.attr]

    def as_view(self):

        @profile_required
        @method_restriction('POST')
        def view(req, **kwargs):
            profile = get_object_or_404(DP, user_id=req.user.id)
            try:
                req_data = json.loads(req.body.decode('utf-8'))
                form_data = {
                    self.attr: self.get_data(req_data, **kwargs)
                }
                form = self.form(instance=profile, data=form_data)
            except (KeyError, json.decoder.JSONDecodeError):
                return HttpResponse('Could not decode json.', status=400)
            if form.is_valid():
                form.save(commit=True)
                return HttpResponse('ok')
            return HttpResponse(str(form.errors), status=400)

        return view


@profile_required
@method_restriction('POST')
def avatar_setting(req, photo_id):
    photo = get_object_or_404(Photo, pk=photo_id)
    if photo.profile != req.user.profile:
        return HttpResponse('This is not your photo', status=403)
    form = AvatarForm(req.POST, req.FILES, initial={
        'image': photo.image
    })
    if form.is_valid():
        photo.add_thumbnail(form.cleaned_data['rel_top'],
                            form.cleaned_data['rel_left'],
                            form.cleaned_data['rel_width'],
                            form.cleaned_data['rel_height'],
                            save=True)
        photo.add_small_thumbnail(save=True)
        photo.profile.avatar = photo
        photo.profile.save()
        return JsonResponse(
            srlzrs.AvatarSerializer.serialize(photo))
    return HttpResponse(str(form.errors), status=400)


@profile_required
@method_restriction('POST')
def file_upload(req):
    """
    View for photo uploading
    """

    form = PhotoForm(req.POST, req.FILES)
    if form.is_valid():
        photo = form.save(commit=False)
        photo.profile = DP.objects.get(user=req.user)
        photo.save()
        dispatch('ADD_PHOTO', req.user.profile, photo=photo)
        if form.cleaned_data['is_avatar']:
            photo.set_as_avatar()
            dispatch('ADD_AVATAR', profile)
    return JsonResponse({
        'id': photo.pk,
        'url': photo.image.url,
        'deleted': photo.is_deleted,
        'isAvatar': photo.is_avatar
    })


@profile_required
@method_restriction('POST')
def answer_question(req, id):
    """
    View for accepting answers
    """

    profile = (
        DP.objects
          .prefetch_related('answers')
          .prefetch_related('answers__question')
          .get(user=req.user)
    )
    question = get_object_or_404(Question, pk=id)

    try:
        answer = profile.answers.get(question__id=id)
    except ObjectDoesNotExist:
        answer = Answer(question=question, profile=profile)

    form = AnswerForm(req.POST, instance=answer)
    if form.is_valid():
        answer = form.save(commit=True)
        Post.create_answer_post(answer)
        dispatch('ANSWER_QUESTION', profile, question=question)
        return HttpResponse('ok')
    return HttpResponse(str(form.errors), status=400)


@profile_required
@method_restriction('POST')
def delete_answer(req, question_id):
    profile = (
        DP.objects
          .prefetch_related('answers')
          .prefetch_related('answers__question')
          .get(user=req.user)
    )
    try:
        answer = profile.answers.get(question__id=question_id)
    except ObjectDoesNotExist:
        return HttpResponse('User has not answered question yet', status=400)
    answer.delete()
    return HttpResponse('ok')


@method_restriction('GET')
def email_check(req):
    """
    Checks whether email is taken or not
    """

    email = req.GET.get('email', None)
    if not email:
        return HttpResponse('Didn\'t receive email param', status=400)
    try:
        User.objects.get(email=email)
        return HttpResponse('taken')
    except ObjectDoesNotExist:
        return HttpResponse('free')


@method_restriction('POST')
def change_email(req):
    """
    View for changing email
    """
    form = ChangeEmailForm(req.POST)
    if form.is_valid():
        user = form.cleaned_data['user']
        new_email = form.cleaned_data['new_email']
        email = EmailAddress.objects.get(user=user)
        email.change(req, new_email, confirm=True)
        messages.warning(
            req, 'Почта была изменена. Теперь ваша почта - %s' % new_email)
    return redirect(reverse('dateprofile:profile'))


@method_restriction('POST')
@profile_required
def delete_photo(req, photo_id):
    photo = get_object_or_404(Photo, pk=photo_id)
    if photo.profile != req.user.profile:
        return HttpResponse('This is not your photo', status=403)
    if photo.is_deleted:
        return HttpResponse('This photo is already deleted', status=400)
    photo.is_deleted = True
    photo.save()
    return HttpResponse('ok')


@method_restriction('POST')
@profile_required
def restore_photo(req, photo_id):
    photo = get_object_or_404(Photo, pk=photo_id)
    if photo.profile != req.user.profile:
        return HttpResponse('This is not your photo', status=403)
    if not photo.is_deleted:
        return HttpResponse('This photo is not deleted', status=400)
    photo.is_deleted = False
    photo.save()
    return HttpResponse('ok')


@method_restriction('POST')
@profile_required
def add_avatar(req):
    profile = req.user.profile
    should_start_emulation = profile.avatar is None
    photo = _add_avatar(req.POST, req.FILES, profile)
    if not photo:
        return HttpResponse(status=400)
    if should_start_emulation:
        start_emulation(profile)
    dispatch('ADD_AVATAR', profile)
    return JsonResponse(
        srlzrs.AvatarSerializer.serialize(photo))


@profile_required
def unread_visits_count(req):
    profile = req.user.profile
    unread_visits_count = profile.unread_visits.count()
    try:
        last_visit_id = profile.unread_visits.latest('created').id
    except ObjectDoesNotExist:
        last_visit_id = 0
    return JsonResponse({
        'count': unread_visits_count,
        'last_id': last_visit_id
    })


@profile_required
def unread_visits(req):
    try:
        last_id = int(req.GET.get('last_id', 0))
    except ValueError:
        return HttpResponse('Could not parse last_id', status=400)
    if not last_id:
        unread_visits = (
            req.user.profile
            .unread_visits
            .select_related('visitor', 'visitor__avatar')
            [:50]
        )
    else:
        visit = get_object_or_404(Visit, pk=last_id)
        unread_visits = (
            req.user.profile
            .unread_visits
            .filter(created__gt=visit.created)
            .select_related('visitor', 'visitor__avatar')
        )
    return JsonResponse(serialize_visits(unread_visits))


@profile_required
@method_restriction('POST')
def subscribe_for_emulation(req):
    profile = req.user.profile
    was_emulating = profile.can_emulate
    profile.can_emulate = True
    profile.save()
    if not was_emulating:
        profile.send_emulation_info_msg()
    return HttpResponse('ok')


@profile_required
@method_restriction('POST')
def delete_visit(req, visit_id):
    profile = req.user.profile
    visit = get_object_or_404(Visit, pk=int(visit_id))
    visit.pseudo_delete(profile)
    return HttpResponse('ok')


@profile_required
def unsubscribe(req):
    if req.method == 'GET':
        return render(req, 'dateprofile/unsubscribe.html', {})
    profile = req.user.profile
    profile.email_subscribed = False
    profile.save()
    return redirect(reverse('dateprofile:profile'))


def test(req):
    return render(req, 'dateprofile/test.html', {
        'domain': 'http://' + settings.DOMAIN
    })


class SocialSignupView(AllauthSocialSignupView):
    form_class = SocialSignupForm
    template_name = 'dateprofile/signup.html'

    def dispatch(self, req, *args, **kwargs):
        res = super().dispatch(req, *args, **kwargs)
        if not hasattr(res, 'context_data'):
            return res
        vk_data = (
            req.session
            .get('socialaccount_sociallogin', {})
            .get('account', {})
            .get('extra_data', {})
        )
        vk_keys = [
            'photo_big',
            'photo_max_orig',
            'bdate',
            'sex',
            'first_name',
            'last_name',
            'email'
        ]
        vk_obj = {}
        for key in vk_keys:
            val = vk_data[key] if key in vk_data else ''
            vk_obj[key] = val
        if (vk_obj['email'] and
            EmailAddress.objects
                .filter(email=vk_obj['email'])
                .exists()):
            messages.warning(
                req,
                'Пользователь с таким email уже зарегистрирован. '
                'Введите email и пароль в форму ниже')
            return redirect(reverse('account_login'))
        res.context_data.update({'VK_DATA': json.dumps(vk_obj)})
        return res


social_signup = SocialSignupView.as_view()


@profile_required
@method_restriction('POST')
def invisible_on(req):
    profile = req.user.profile
    profile.invisible = True
    profile.save()
    return HttpResponse('ok')


@profile_required
@method_restriction('POST')
def invisible_off(req):
    profile = req.user.profile
    profile.invisible = False
    profile.save()
    return HttpResponse('ok')


@profile_required
@method_restriction('GET')
def settings_page(req):
    return render(req, 'dateprofile/settings.html', {
        'active': 'settings'
    })


@profile_required
@method_restriction('POST')
def toggle_email_subscription(req):
    profile = req.user.profile
    profile.email_subscribed = not profile.email_subscribed
    profile.save()
    print(profile.email_subscribed)
    return HttpResponse('ok')


@profile_required
@method_restriction('POST')
def change_password(req):
    profile = req.user.profile
    old_password = req.POST.get('old_password', '')
    new_password = req.POST.get('new_password', '')
    if len(new_password) < 8:
        return HttpResponse('fail', status=400)
    if profile.user.check_password(old_password):
        profile.user.set_password(new_password)
        profile.user.save()
        return HttpResponse('ok')
    return HttpResponse('fail', status=400)


change_name = (
    permission_required('change_name')(
    profile_required(
    method_restriction('POST')(
    ProfileSetting('name').as_view()))))
