from django.test import TestCase, Client
from django.urls import reverse

from dating.test_utils import FixturedTestCase
from feedbacks.models import Feedback


class FeedbacksTest(FixturedTestCase):
    def test_submit(self):
        """
        Test whether it is possible to submit a feedback
        """
        url = reverse('feedbacks:send_feedback')
        data = {
            'url': 'http://localhost:8000/profile',
            'text': 'BUG 4ITO PODELAT'
        }
        res = self.client.post(url, data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.content, b'ok')
