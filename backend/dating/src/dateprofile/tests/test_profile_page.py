import json
import os
import hashlib

from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from django.db.models import Q
from django.core.files.uploadedfile import SimpleUploadedFile
from django.conf import settings

from allauth.account.models import EmailAddress

from dateprofile.models import DateProfile as DP, Question, Answer, Visit


class DateProfileTest(TestCase):
    fixtures = ['users.json']

    def setUp(self):
        super().setUp()
        self.client = Client()
        self.client.login(email='user1@gmail.com', password='qweasdzxc')
        self.user = User.objects.get(email='user1@gmail.com')

    def _create_answer(self, profile):
        question = Question.objects.all()[0]
        return Answer.objects.create(
            profile=profile, question=question, text='qwe')

    def test_self_profile(self):
        """
        Tests if right page gets rendered for /profile/
        """
        res = self.client.get(
            reverse('dateprofile:profile', args=(self.user.profile.id,)))
        self.assertTrue(res.context['own'])
        questions = list(
            res.context['questions'].order_by('text').values_list('text'))
        expected = list(
            Question.objects.all().order_by('text').values_list('text'))
        self.assertListEqual(questions, expected)

    def test_other_profile(self):
        """
        Tests if right page gets rendered for /profile/<id>/
        """
        other_user = User.objects.get(email='user2@gmail.com')
        res = self.client.get(
            reverse('dateprofile:profile', args=(other_user.profile.id,)))
        self.assertFalse(res.context['own'])

    def test_update_search(self):
        """
        Tests if user can update search options
        """
        self.client.post(reverse('dateprofile:update_search'), {
            'lower_age_bound': 20,
            'upper_age_bound': 21,
            'looking_for': 'female',
            'purpose': 'long_term'
        })
        profile = DP.objects.get(pk=self.user.profile.id)
        self.assertEqual(profile.lower_age_bound, 20)
        self.assertEqual(profile.upper_age_bound, 21)
        self.assertEqual(profile.looking_for, 'female')

    def test_update_character(self):
        """
        Tests if user can update self character options
        """
        self.client.post(reverse('dateprofile:update_character'), {
            'alcohol_attitude': 'no_drink',
            'smoking_attitude': 'negative',
            'build': 'thin',
        })
        profile = DP.objects.get(pk=self.user.profile.id)
        self.assertEqual(profile.alcohol_attitude, 'no_drink')
        self.assertEqual(profile.smoking_attitude, 'negative')
        self.assertEqual(profile.build, 'thin')

    def test_email_check(self):
        """
        Tests email check
        """
        template = '{}?email={}'
        url = reverse('dateprofile:email_check')
        res = self.client.get(template.format(url, 'user1@gmail.com'))
        self.assertEqual(res.content, b'taken')
        res = self.client.get(template.format(url, 'asadsasda@sadasd.com'))
        self.assertEqual(res.content, b'free')

    def test_answer_unanswered_question(self):
        """
        Tests if user can answer unanswered question
        """
        profile = self.user.profile
        question = Question.objects.filter(~Q(answers__profile=profile))[0]
        url = reverse('dateprofile:answer_question', args=(question.id,))
        self.client.post(url, {
            'text': 'abc'
        })
        profile = DP.objects.get(pk=profile.id)
        answer = profile.answers.get(question__id=question.id)
        self.assertEqual(answer.text, 'abc')
        self.assertEqual(answer.profile.id, profile.id)
        self.assertEqual(answer.question.id, question.id)
        answer.delete()

    def test_answer_answered_question(self):
        """
        Tests if user can answer answered question
        """
        profile = self.user.profile
        answer = self._create_answer(self.user.profile)
        url = reverse('dateprofile:answer_question',
                      args=(answer.question.id,))
        self.client.post(url, {'text': 'zxc'})
        answer = profile.answers.get(pk=answer.id)
        self.assertEqual(answer.text, 'zxc')
        answer.delete()

    def test_delete_answer(self):
        """
        Tests if user can delete answer
        """
        profile = self.user.profile
        answer = self._create_answer(self.user.profile)
        url = reverse('dateprofile:delete_answer',
                      args=(answer.question.pk,))
        res = self.client.post(url)
        self.assertEqual(res.content, b'ok')

    def test_change_email(self):
        """
        Tests if user can change email during email confirmation
        """
        user = self.user
        url = reverse('dateprofile:change_email')
        m = hashlib.md5()
        m.update(((settings.SECRET_KEY + str(user.pk)).encode('utf-8')))
        self.client.post(url, {
            'user': user.pk,
            'new_email': 'x@x.com',
            'secret': str(m.hexdigest())
        })
        email = EmailAddress.objects.get(user=user)
        self.assertEqual(email.email, 'x@x.com')

    def test_unread_visits_count(self):
        """
        Tests if determining an amount of unread visists works correct
        """
        profile = self.user.profile
        profile2 = DP.objects.filter(~Q(pk=profile.pk))[0]
        visit = Visit.objects.create(visitor=profile2, visited=profile)
        res = self.client.get(reverse('dateprofile:unread_visits_count'))
        data = json.loads(res.content.decode('utf-8'))
        self.assertEqual(data['last_id'], visit.id)
        self.assertEqual(data['count'], 1)
        visit.delete()

    def test_unread_visits(self):
        """
        Tests if determining unread visists works correct
        """
        profile = self.user.profile
        profile2 = DP.objects.filter(~Q(pk=profile.pk))[0]
        profile3 = DP.objects.filter(~Q(pk=profile.pk))[1]
        visit1 = Visit.objects.create(visitor=profile2, visited=profile)
        visit2 = Visit.objects.create(visitor=profile3, visited=profile)
        res = self.client.get(reverse('dateprofile:unread_visits'))
        data = json.loads(res.content.decode('utf-8'))
        self.assertEqual(len(data['items']), 2)
        res = self.client.get(reverse('dateprofile:unread_visits') +
                              '?last_id={}'.format(visit1.id))
        data = json.loads(res.content.decode('utf-8'))
        self.assertEqual(len(data['items']), 1)
        visit1.is_deleted = True
        visit1.save()
        res = self.client.get(reverse('dateprofile:unread_visits'))
        data = json.loads(res.content.decode('utf-8'))
        self.assertEqual(len(data['items']), 1)
        visit1.delete()
        visit2.delete()

    def test_delete_visits(self):
        """
        Tests if user can delete visit
        """
        profile = self.user.profile
        profile2 = DP.objects.filter(~Q(pk=profile.pk))[0]
        visit = Visit.objects.create(visitor=profile2, visited=profile)
        res = self.client.post(reverse('dateprofile:delete_visit',
                               kwargs={'visit_id': visit.id}))
        self.assertEqual(res.content, b'ok')
        self.assertEqual(Visit.objects.get(pk=visit.id).is_deleted, True)

    @classmethod
    def tearDownClass(cls):
        User.objects.all().delete()
