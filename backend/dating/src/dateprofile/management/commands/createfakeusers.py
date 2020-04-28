import os, os.path
import uuid
import random
from datetime import timedelta, datetime, date

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User

from allauth.account.models import EmailAddress

from dateprofile.models import DateProfile as DP
from dateprofile.models import City


class Command(BaseCommand):
    help = 'Loads fake users in the db'

    def add_arguments(self, parser):
        parser.add_argument('names', type=str)
        parser.add_argument('sex', type=str)

    def handle(self, *args, **options):
        sex = options['sex']
        if sex not in ['male', 'female']:
            raise ValueError('sex option must be `female` or `male`')
        names_file = options['names']
        user_index = 0
        purposes = ['long_term', 'short_term', 'new_friends']
        builds = ['thin', 'average', 'sport', 'fat']
        alcohol = ['no_drink', 'rarely', 'often', 'company']
        smoking = ['negative', 'rarely', 'often']
        city = City.objects.get(name='Москва', name_en='Moscow')
        with open(names_file, 'r') as f:
          data = f.read().split('\n')
          persons = []
          for d in data:
            if not d: continue
            name, _age = d.split(', ')
            age = int(_age)
            persons.append((name, age))
        looking_for = 'male' if sex == 'female' else 'female'
        for p in persons:
            name = p[0]
            email = 'user{}@fak3mail.ru'.format(str(uuid.uuid4())[:8])
            print(email)
            u = User.objects.create(
              username=email[:email.index('@')],
              email=email
            )
            u.set_password('qweasdzxc')
            u.save()
            EmailAddress.objects.create(user=u,
                                        email=email,
                                        primary=True,
                                        verified=True)
            DP.objects.create(
              user=u,
              sex=sex,
              looking_for=looking_for,
              name=name,
              birthday=date(2017-p[1], 1, 1),
              lower_age_bound=20,
              upper_age_bound=40,
              purpose=random.choice(purposes),
              build=random.choice(builds),
              alcohol_attitude=random.choice(alcohol),
              smoking_attitude=random.choice(smoking),
              status='vip',
              _city=city,
              is_fake=True,
            )
