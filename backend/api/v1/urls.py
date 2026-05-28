from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from apps.users.views import RegisterView, LoginView, UserProfileView
from apps.designs.views import DesignViewSet
from apps.materials.views import MaterialViewSet
from apps.templates_app.views import TemplateViewSet
from apps.assets.views import AssetViewSet

router = DefaultRouter()
router.register(r'designs', DesignViewSet, basename='design')
router.register(r'materials', MaterialViewSet, basename='material')
router.register(r'templates', TemplateViewSet, basename='template')
router.register(r'assets', AssetViewSet, basename='asset')

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Users
    path('users/me/', UserProfileView.as_view(), name='user-profile'),
    
    # Router URLs
    path('', include(router.urls)),
]
