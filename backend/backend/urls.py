"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from app.controller import TicketViewSet, TicketCategoryViewSet, ProtectedEndpointView, CommentViewSet, UserViewSet, \
    register, verify_code, backup_database, get_logs
from app.controller import LoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
router = routers.DefaultRouter()
router.register('tickets', TicketViewSet)
router.register('categories', TicketCategoryViewSet)
router.register('comments', CommentViewSet)
router.register('user', UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/register/', register, name='register'),
    path('api/verify_code/', verify_code, name='verify_code'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('backup-database/', backup_database, name='backup_database'),
    path('get-logs/', get_logs, name='get_logs'),
    path('api/protected/', ProtectedEndpointView.as_view(), name='protected_endpoint'),  # защищенный эндпоинт
]
