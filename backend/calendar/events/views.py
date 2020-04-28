from django.http import Http404

from rest_framework import viewsets, mixins
from rest_framework.response import Response
from cities_light.models import City
from django_filters.rest_framework import DjangoFilterBackend

from .models import Plan, TimeSlot
from .serializers import (
    PlanSerializer, TimeSlotSerializer, EditablePlanSerializer, CitySerializer
)
from .permissions import TimeSlotPermission, PlanPermission
from .filters import CityFilter
from .bl import clone_plan
from recaptcha.bl import incr_attempts


class PlanRetrieveView(object):
    def retrieve(self, request, pk=None):
        if Plan.objects.filter(read_id=pk).exists():
            plan = Plan.objects.get(read_id=pk)
            write_access = False
        elif Plan.objects.filter(edit_id=pk).exists():
            plan = Plan.objects.get(edit_id=pk)
            write_access = True
        else:
            raise Http404
        serialized = PlanSerializer(plan, write_access=write_access, context={
            'request': request,
        })
        return Response(serialized.data)


class CreatePlanMixin(mixins.CreateModelMixin):
    def perform_create(self, serializer):
        parent_id = serializer.validated_data.get('parent_id')
        if not parent_id:
            super().perform_create(serializer)
        else:
            name = serializer.validated_data['name']
            start_date = serializer.validated_data['start_date']
            serializer.instance = clone_plan(name, parent_id, start_date)
        incr_attempts(self.request)


class PlanViewSet(
    PlanRetrieveView,
    CreatePlanMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Plan.objects.all()
    serializer_class = EditablePlanSerializer

    permission_classes = (PlanPermission,)


class TimeSlotViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer

    permission_classes = (TimeSlotPermission,)


class CitiesViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = City.objects.order_by('-population')
    serializer_class = CitySerializer
    permission_classes = tuple()
    filter_backends = (DjangoFilterBackend,)
    filter_class = CityFilter
