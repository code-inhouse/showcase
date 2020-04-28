import json
from datetime import datetime

from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from django.db.models import Q
from django.db.utils import IntegrityError

from autofixture import AutoFixture

from dateprofile.models import DateProfile as DP, City

from dating.test_utils import FixturedTestCase

from .models import Like


class LikesTest(FixturedTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        city_fixture = AutoFixture(City, field_values={
            'name': 'Москва'
        })
        city = city_fixture.create(1)[0]

    def _create_or_get(self, profile1, profile2):
        try:
            like = Like.objects.create(liker=profile1, liked=profile2)
        except IntegrityError:
            like = Like.objects.get(liker=profile1, liked=profile2)
        return like

    def test_like(self):
        """
        Tests if user can like unliked person and cannot like liked one
        """
        profile = self.user.profile
        profile2 = DP.objects.filter(~Q(pk=profile.id))[0]
        res = self.client.post(reverse('likes:like',
                               kwargs={'profile_id': profile2.id}))
        data = json.loads(res.content.decode('utf-8'))
        self.assertIn('id', data)
        res = self.client.post(reverse('likes:like',
                               kwargs={'profile_id': profile2.id}))
        self.assertEqual(res.status_code, 400)

    def test_unlike(self):
        """
        Tests whether user can delete a like
        """
        profile = self.user.profile
        profile2 = DP.objects.filter(~Q(pk=profile.id))[0]
        self._create_or_get(profile, profile2)
        res = self.client.post(reverse('likes:unlike',
                               kwargs={'profile_id': profile2.id}))
        self.assertEqual(res.status_code, 200)

    def test_dislike(self):
        """
        Tests whether user can dislike someone (matches game)
        """
        profile = self.user.profile
        profile2 = DP.objects.filter(~Q(pk=profile.id))[0]
        res = self.client.post(reverse('likes:dislike',
                               kwargs={'profile_id': profile2.id}))
        self.assertEqual(res.status_code, 200)

    def test_matches(self):
        """
        Tests whether user will get matches mathching his search settings
        """

        def get_profile(values):
            return (
                AutoFixture(DP, generate_fk=['user'], field_values=values)
                .create(1)[0]
            )

        client = Client()
        field_values = {
            'ip': '77.128.9.1',
            'lower_age_bound': 18,
            'upper_age_bound': 25,
            'height': 175,
            'sex': 'male',
            'looking_for': 'female'
        }
        profile = get_profile(field_values)
        profile.user.set_password('qweasdzxc')
        profile.user.save()
        client.login(email=profile.user.email, password='qweasdzxc')
        field_values['sex'] = 'female'
        field_values['birthday'] = datetime(1997, 1, 1)
        profile1 = get_profile(field_values)
        field_values['sex'] = 'male'
        profile2 = get_profile(field_values)
        res = client.get(reverse('likes:matches'))
        data = json.loads(res.content.decode('utf-8'))
        self.assertEqual(1, len(data))

    def test_matches_page(self):
        """
        Tests whether right template gets rendered for a game url
        """
        res = self.client.get(reverse('likes:game'))
        self.assertTemplateUsed(res, 'likes/matches.html')

    def test_info_page(self):
        """
        Tests whether right template gets rendered for an info url
        """
        res = self.client.get(reverse('likes:info'))
        self.assertTemplateUsed(res, 'likes/info.html')

    def test_unread_likes_count(self):
        """
        Tests whether url returns right json, containing
        last unread like id and amount of unread likes
        """
        profile1 = DP.objects.all()[1]
        profile2 = DP.objects.all()[2]
        profile3 = DP.objects.all()[3]
        Like.objects.create(liker=profile1,
                            liked=self.profile,
                            notified=True)
        Like.objects.create(liker=profile2, liked=self.profile)
        like = Like.objects.create(liker=profile3,
                                   liked=self.profile)
        res = self.client.get(reverse('likes:unread_likes_count'))
        data = json.loads(res.content.decode('utf-8'))
        self.assertEqual(data['last_id'], like.pk)
        self.assertEqual(data['count'], 2)

    def test_unread_likes_without_last_id(self):
        """
        Tests whether right likes get returned for
        unread_likes url (without last_id param)
        """
        profile1 = DP.objects.all()[1]
        profile2 = DP.objects.all()[2]
        profile3 = DP.objects.all()[3]
        like1 = Like.objects.create(liker=profile1,
                            liked=self.profile,
                            notified=True)
        like2 = Like.objects.create(liker=profile2,
                                    liked=self.profile)
        like3 = Like.objects.create(liker=profile3,
                                   liked=self.profile)
        res = self.client.get(reverse('likes:unread_likes'))
        data = json.loads(res.content.decode('utf-8'))
        self.assertEqual(len(data['items']), 2)
        ids = list(map(lambda x: x['id'], data['items']))
        self.assertNotIn(like1.pk, ids)
        self.assertIn(like2.pk, ids)
        self.assertIn(like3.pk, ids)

    def test_unread_likes_with_last_id(self):
        """
        Tests whether right likes get returned for
        unread_likes url (with last_id param)
        """
        profile1 = DP.objects.all()[1]
        profile2 = DP.objects.all()[2]
        profile3 = DP.objects.all()[3]
        like1 = Like.objects.create(liker=profile1,
                            liked=self.profile,
                            notified=True)
        like2 = Like.objects.create(liker=profile2,
                                    liked=self.profile)
        like3 = Like.objects.create(liker=profile3,
                                   liked=self.profile)
        url = (reverse('likes:unread_likes') +
              '?last_id=%s' % like2.pk)
        res = self.client.get(url)
        data = json.loads(res.content.decode('utf-8'))
        self.assertEqual(len(data['items']), 1)
        self.assertEqual(data['items'][0]['id'], like3.pk)

    def test_mutual_without_last_id(self):
        """
        Tests whether right mutual likes get returned
        (without last_id param)
        """
        profile1 = DP.objects.all()[1]
        profile2 = DP.objects.all()[2]
        profile3 = DP.objects.all()[3]
        like1 = Like.objects.create(liker=profile1,
                            liked=self.profile,
                            notified=True)
        like2 = Like.objects.create(liker=profile2,
                                    liked=self.profile)
        like3 = Like.objects.create(liker=profile3,
                                   liked=self.profile)
        like4 = Like.objects.create(liker=self.profile,
                                    liked=profile2)
        res = self.client.get(reverse('likes:mutual'))
        data = json.loads(res.content.decode('utf-8'))
        self.assertEqual(len(data['items']), 1)
        self.assertEqual(data['items'][0]['id'], like4.pk)
        self.assertEqual(data['items'][0]['liked_id'],
                         profile2.pk)

    def test_mutual_with_last_id(self):
        """
        Tests whether right mutual likes get returned
        (with last_id param)
        """
        profile1 = DP.objects.all()[1]
        profile2 = DP.objects.all()[2]
        profile3 = DP.objects.all()[3]
        like1 = Like.objects.create(liker=profile1,
                            liked=self.profile,
                            notified=True)
        like2 = Like.objects.create(liker=profile2,
                                    liked=self.profile)
        like3 = Like.objects.create(liker=profile3,
                                   liked=self.profile)
        like4 = Like.objects.create(liker=self.profile,
                                    liked=profile2)
        like5 = Like.objects.create(liker=self.profile,
                                    liked=profile3)
        url = reverse('likes:mutual') + '?last_id=%s' % like4.pk
        res = self.client.get(url)
        data = json.loads(res.content.decode('utf-8'))
        self.assertEqual(len(data['items']), 1)
        self.assertEqual(data['items'][0]['id'], like5.pk)
        self.assertEqual(data['items'][0]['liked_id'],
                         profile3.pk)

    def test_mutual_count(self):
        """
        Tests whether right mutual like count gets returned
        """
        profile1 = DP.objects.all()[1]
        profile2 = DP.objects.all()[2]
        profile3 = DP.objects.all()[3]
        like1 = Like.objects.create(liker=profile1,
                            liked=self.profile,
                            notified=True)
        like2 = Like.objects.create(liker=profile2,
                                    liked=self.profile)
        like3 = Like.objects.create(liker=profile3,
                                   liked=self.profile)
        like4 = Like.objects.create(liker=self.profile,
                                    liked=profile2)
        like5 = Like.objects.create(liker=self.profile,
                                    liked=profile3)
        res = self.client.get(reverse('likes:mutual_count'))
        data = json.loads(res.content.decode('utf-8'))
        self.assertEqual(data['last_id'], like5.pk)
        self.assertEqual(data['count'], 2)

    def test_view_mutual(self):
        """
        Tests whether it is possible to view mutual like by
        POST method to the right url
        """
        profile1 = DP.objects.all()[1]
        profile2 = DP.objects.all()[2]
        profile3 = DP.objects.all()[3]
        like1 = Like.objects.create(liker=profile1,
                            liked=self.profile,
                            notified=True)
        like2 = Like.objects.create(liker=profile2,
                                    liked=self.profile)
        like3 = Like.objects.create(liker=profile3,
                                   liked=self.profile)
        like4 = Like.objects.create(liker=self.profile,
                                    liked=profile2)
        like5 = Like.objects.create(liker=self.profile,
                                    liked=profile3)
        url = reverse('likes:view_mutual', args=(like4.pk,))
        res = self.client.post(url)
        self.assertEqual(res.content, b'ok')
        test_like = Like.objects.get(pk=like4.pk)
        self.assertEqual(test_like.mutual_viewed, True)

    def test_delete_self_like(self):
        """
        Tests whether it is possible to 'delete' self like
        """
        profile = DP.objects.all()[1]
        like = Like.objects.create(liker=self.profile,
                                   liked=profile)
        url = reverse('likes:delete_like', args=(like.pk,))
        res = self.client.post(url)
        self.assertEqual(res.content, b'ok')
        self.assertEqual(
            Like.objects.get(pk=like.pk).liker_deleted,
            True
        )

    def test_delete_not_liked_me_like(self):
        """
        Test whether it is possible to 'delete' like where someone
        liked me
        """
        profile = DP.objects.all()[1]
        like = Like.objects.create(liker=profile,
                                   liked=self.profile)
        url = reverse('likes:delete_like', args=(like.pk,))
        res = self.client.post(url)
        self.assertEqual(res.content, b'ok')
        self.assertEqual(
            Like.objects.get(pk=like.pk).liked_deleted,
            True
        )

    def test_delete_not_my_like(self):
        """
        Tests whether it is not possible to delete like not
        related to me
        """
        profile1 = DP.objects.all()[1]
        profile2 = DP.objects.all()[2]
        like = Like.objects.create(liker=profile1,
                                   liked=profile2)
        url = reverse('likes:delete_like', args=(like.pk,))
        res = self.client.post(url)
        self.assertEqual(res.status_code, 403)
        test_like = Like.objects.get(pk=like.pk)
        self.assertEqual(test_like.liked_deleted, False)
        self.assertEqual(test_like.liker_deleted, False)

    def tearDown(self):
        Like.objects.all().delete()
