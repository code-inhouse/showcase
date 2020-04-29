from core.router import router
from .views import PlanViewSet, TimeSlotViewSet, CitiesViewSet


router.register('plans', PlanViewSet, basename='plan')
router.register('timeslots', TimeSlotViewSet)
router.register('cities', CitiesViewSet)
