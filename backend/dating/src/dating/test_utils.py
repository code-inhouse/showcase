from django.test import TestCase, Client
from django.contrib.auth.models import User

from autofixture import AutoFixture

from dateprofile.models import DateProfile as DP


class FixturedTestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        fixture = AutoFixture(
            DP,
            generate_fk=['user'],
            field_values={
            'ip': '77.128.9.1',
            'lower_age_bound': 18,
            'upper_age_bound': 25,
            'height': 175
        })
        profiles = fixture.create(10)

    def setUp(self):
        super().setUp()
        self.profile = DP.objects.all()[0]
        self.user = self.profile.user
        self.user.set_password('qweasdzxc')
        self.user.save()
        self.client = Client()
        self.client.login(email=self.user.email,
                          password='qweasdzxc')

    @classmethod
    def tearDownClass(cls):
        User.objects.all().delete()
