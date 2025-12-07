from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AncViewSet,dashboard
router = DefaultRouter()
router.register(r'anc', AncViewSet, basename='anc') 

urlpatterns = [
    path('', include(router.urls)),
    path("anc/dashboard",dashboard, name="anc-dashboard")
]
