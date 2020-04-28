import json
from datetime import date

import pytest

from events.models import Plan, TimeSlot


pytestmark = pytest.mark.django_db


def test_create_plan(client):
    res = client.post('/api/plans/', json.dumps({
        'start_date': '2019-03-01',
        'end_date': '2019-03-15',
        'name': 'test'
    }), content_type='application/json')
    assert res.status_code == 201


def test_can_retrive_plan_for_read(dummy_data, client):
    plan = Plan.objects.last()
    res = client.get(f'/api/plans/{plan.read_id}/')
    assert res.status_code == 200
    assert res.json()['edit_id'] is None


def test_can_retrive_plan_for_write(dummy_data, client):
    plan = Plan.objects.last()
    res = client.get(f'/api/plans/{plan.edit_id}/')
    assert res.status_code == 200
    assert res.json()['edit_id'] == str(plan.edit_id)


def test_cannot_update_plan(dummy_data, client):
    plan = Plan.objects.last()
    res = client.put(f'/api/plans/{plan.id}/', json.dumps({
        'start_date': '2019-03-01',
        'end_date': '2019-03-15',
        'name': 'test'
    }), content_type='application/json')
    assert res.status_code == 403


def test_can_update_plan(dummy_data, client):
    plan = Plan.objects.last()
    res = client.put(
        f'/api/plans/{plan.id}/',
        json.dumps({
            'start_date': '2019-03-10',
            'end_date': '2019-03-15',
            'name': 'test'
        }),
        content_type='application/json',
        HTTP_X_EDITID=str(plan.edit_id)
    )
    assert res.status_code == 200


def test_cannot_delete_plan(dummy_data, client):
    plan = Plan.objects.last()
    res = client.delete(f'/api/plans/{plan.id}/')
    assert res.status_code == 403


def test_can_delete_plan(dummy_data, client):
    plan = Plan.objects.last()
    res = client.delete(f'/api/plans/{plan.id}/',
                        HTTP_X_EDITID=str(plan.edit_id))
    assert res.status_code == 204


def test_cannot_create_timeslot(dummy_data, client):
    plan = Plan.objects.last()
    res = client.post(f'/api/timeslots/', json.dumps({
        'plan': f'/api/plans/{plan.id}/',
        'name': 'test',
        'hour': 12,
        'minute': 0,
        'duration': 30,
        'date': '2019-03-12'
    }), content_type='application/json')
    assert res.status_code == 403


def test_can_create_timeslot(dummy_data, client):
    plan = Plan.objects.last()
    res = client.post(
        f'/api/timeslots/',
        json.dumps({
            'plan': plan.id,
            'name': 'test',
            'hour': 12,
            'minute': 0,
            'duration': 30,
            'date': '2019-03-12'
        }),
        content_type='application/json',
        HTTP_X_EDITID=str(plan.edit_id)
    )
    assert res.status_code == 201


def test_cannot_create_timeslot_other_plan(dummy_data, client):
    plan = Plan.objects.last()
    other_plan = Plan.objects.create(
        name='test',
        start_date=date(2018, 10, 1),
        end_date=date(2018, 10, 5),
    )
    res = client.post(
        f'/api/timeslots/',
        json.dumps({
            'plan': other_plan.id,
            'name': 'test',
            'hour': 12,
            'minute': 0,
            'duration': 30,
            'date': '2019-03-12'
        }),
        content_type='application/json',
        HTTP_X_EDITID=str(plan.edit_id)
    )
    assert res.status_code == 400


def test_cannot_delete_timeslot(dummy_data, client):
    ts = TimeSlot.objects.last()
    res = client.delete(f'/api/timeslots/{ts.id}/',
                        content_type='application/json')
    assert res.status_code == 403


def test_can_delete_timeslot(dummy_data, client):
    ts = TimeSlot.objects.last()
    res = client.delete(f'/api/timeslots/{ts.id}/',
                        content_type='application/json',
                        HTTP_X_EDITID=str(ts.plan.edit_id))
    assert res.status_code == 204


def test_cannot_update_timeslot(dummy_data, client):
    ts = TimeSlot.objects.last()
    res = client.put(f'/api/timeslots/{ts.id}/', json.dumps({
        'plan': ts.plan.id,
        'name': 'test',
        'hour': 12,
        'minute': 0,
        'duration': 30,
        'date': '2019-03-12'
    }), content_type='application/json')
    assert res.status_code == 403


def test_can_update_timeslot(dummy_data, client):
    ts = TimeSlot.objects.last()
    res = client.put(
        f'/api/timeslots/{ts.id}/',
        json.dumps({
            'plan': ts.plan.id,
            'name': 'test',
            'hour': 12,
            'minute': 0,
            'duration': 30,
            'date': '2019-03-12'
        }),
        content_type='application/json',
        HTTP_X_EDITID=str(ts.plan.edit_id)
    )
    assert res.status_code == 200


def test_cannot_update_timeslot_other_plan(dummy_data, client):
    ts = TimeSlot.objects.last()
    other_plan = Plan.objects.create(
        name='test',
        start_date=date(2018, 10, 1),
        end_date=date(2018, 10, 5),
    )
    res = client.put(
        f'/api/timeslots/{ts.id}/',
        json.dumps({
            'plan': other_plan.id,
            'name': 'test',
            'hour': 12,
            'minute': 0,
            'duration': 30,
            'date': '2019-03-12'
        }),
        content_type='application/json',
        HTTP_X_EDITID=str(ts.plan.edit_id)
    )
    assert res.status_code == 400


def test_clone_plan(dummy_data, client):
    plan = Plan.objects.last()
    res = client.post('/api/plans/', json.dumps({
        'start_date': '2019-04-02',
        'end_date': '2019-04-10',
        'parent_id': str(plan.edit_id),
        'name': 'hello',
    }), content_type='application/json')
    new_plan = Plan.objects.last()
    assert res.status_code == 201
    assert plan.timeslots.count() == new_plan.timeslots.count()
    assert new_plan.end_date - new_plan.start_date == plan.end_date - plan.start_date


def test_cannot_create_too_many_timeslots(client):
    plan = Plan.objects.create(
        name='asdad',
        start_date='2019-04-02',
        end_date='2019-04-10',
    )
    timeslots = [
        TimeSlot(
            plan=plan,
            hour=10,
            minute=10,
            duration=1,
            date='2019-04-03',
            description='asfafsa',
            place='asfsafsaf',
            color='grey',
        )
        for _ in range(200)
    ]
    TimeSlot.objects.bulk_create(timeslots)
    res = client.post(
        '/api/timeslots/',
        json.dumps({
            'plan': plan.id,
            'name': 'test',
            'hour': 12,
            'minute': 0,
            'duration': 30,
            'date': '2019-04-04'
        }),
        content_type='application/json',
        HTTP_X_EDITID=str(plan.edit_id)
    )
    assert res.status_code == 400

