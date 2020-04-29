from django.db import transaction
from django.db.models import Q

from .models import Plan, TimeSlot


@transaction.atomic
def clone_plan(name, parent_plan_id, start_date):
    parent_plan = Plan.objects.get(Q(edit_id=parent_plan_id) | Q(read_id=parent_plan_id))
    td = start_date - parent_plan.start_date
    plan = Plan.objects.create(
        name=name,
        start_date=start_date,
        end_date=parent_plan.end_date + td,
        description=parent_plan.description,
        city=parent_plan.city,
        parent_plan_id=parent_plan.id
    )
    timeslots = [
        TimeSlot(
            name=timeslot.name,
            hour=timeslot.hour,
            minute=timeslot.minute,
            duration=timeslot.duration,
            date=timeslot.date + td,
            description=timeslot.description,
            place=timeslot.place,
            color=timeslot.color,
            plan_id=plan.id,
        )
        for timeslot in parent_plan.timeslots.all()
    ]
    TimeSlot.objects.bulk_create(timeslots)
    return plan
