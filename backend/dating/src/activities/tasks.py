from random import randint

from celery.contrib import rdb

from dating.celery import app
from dateprofile.models import DateProfile as DP, Visit
from likes.models import Like
from chats.models import Chat, Message
from configurations.models import IntervalsConfig

from .models import Contact, ContactJournal


def find_profile_and_emulator(pk):
    profile = DP.objects.get(pk=pk)
    if profile.can_emulate:
        return None
    emulator = profile.get_emulator()
    if not emulator:
        return None
    return profile, emulator


@app.task()
def emulate_like(liked):
    prof_emu = find_profile_and_emulator(liked)
    if not prof_emu:
        return
    profile, emulator = prof_emu
    Like.objects.create(liker=emulator, liked=profile)
    contact_kwargs = {
        'emulator': emulator,
        'contacted': profile,
        'type': 'like'
    }
    Contact.objects.create(**contact_kwargs)


@app.task()
def emulate_visit(visited):
    prof_emu = find_profile_and_emulator(visited)
    if not prof_emu:
        return
    profile, emulator = prof_emu
    Visit.objects.create(visitor=emulator, visited=profile)
    contact_kwargs = {
        'emulator': emulator,
        'contacted': profile,
        'type': 'visit'
    }
    Contact.objects.create(**contact_kwargs)


@app.task()
def emulate_message(messaged):
    prof_emu = find_profile_and_emulator(messaged)
    if not prof_emu:
        return
    profile, emulator = prof_emu
    chat = Chat.get_chat(profile, emulator)
    Message.objects.create(
        chat=chat,
        receiver=profile,
        sender=emulator,
        body='Привет')
    contact_kwargs = {
        'emulator': emulator,
        'contacted': profile,
        'type': 'message'
    }
    Contact.objects.create(**contact_kwargs)


def start_emulation(profile):
    activity_config = profile.activity_config
    durations = IntervalsConfig.get_solo().intervals  # seconds
    intervals = []
    start = 10
    for duration in durations:
        finish = start + duration
        intervals.append((start, finish))
        start = finish
    for interval in intervals:
        start, end = interval
        for like in range(activity_config.likes_per_interval):
            emulate_like.apply_async(
                (profile.id,),
                countdown=randint(start, end),
                retry=False)
        for visit in range(activity_config.visits_per_interval):
            emulate_visit.apply_async(
                (profile.id,),
                countdown=randint(start, end),
                retry=False)
        for message in range(activity_config.messages_per_interval):
            emulate_message.apply_async(
                (profile.id,),
                countdown=randint(start, end),
                retry=False)
