import pytest

from django.core.management import call_command


@pytest.fixture
@pytest.mark.django_db
def dummy_data():
    call_command('loaddata', 'events.json')
