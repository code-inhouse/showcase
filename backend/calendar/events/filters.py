from django_filters import rest_framework as filters
from cities_light.models import City


class CityFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='search_names', lookup_expr='icontains')

    class Meta:
        model = City
        fields = ['name']
