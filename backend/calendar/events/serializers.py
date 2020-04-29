from rest_framework import serializers

from cities_light.models import City
from .models import Plan, TimeSlot


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = (
            'name',
            'id',
            'days',
            'timeslots',
            'read_id',
            'edit_id',
            'start_date',
            'end_date',
            'description',
            'city',
            'city_id',
            'place',
            'parent_id',
        )
        read_only_fields = ('read_id', 'id', 'days', 'city',)
        write_only_fields = ('city_id', 'parent_id',)
        depth = 1

    edit_id = serializers.SerializerMethodField(read_only=True)
    city_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(),
        write_only=True,
        source='city',
        required=False
    )
    city = CitySerializer(read_only=True)
    parent_id = serializers.CharField(write_only=True, required=False)

    def __init__(self, *args, write_access=False, **kwargs):
        super().__init__(*args, **kwargs)
        self.write_access = write_access

    def get_edit_id(self, obj):
        if self.write_access:
            return obj.edit_id
        return None


class EditablePlanSerializer(PlanSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, write_access=True, **kwargs)


class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ('id', 'hour', 'name', 'minute', 'date', 'plan', 'duration',
                  'description', 'place', 'color')
        read_only_fields = ('id',)
        write_only_fields = ('plan',)

    def __init__(self, *args, context, **kwargs):
        super().__init__(*args, context=context, **kwargs)
        self.edit_id = context['request'].META.get('HTTP_X_EDITID')

    def validate_plan(self, plan):
        if not self.edit_id == str(plan.edit_id):
            raise serializers.ValidationError(
                'Trying to change plan without edit_id'
            )
        if plan.timeslots.count() == 200:
            raise serializers.ValidationError(
                'Too many timeslots',
            )
        return plan
