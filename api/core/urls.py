from django.urls import path
from .views import LoginView, RegisterView, LogoutView, admin_user_details,user_details

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('admin/user_details/<int:id>/', admin_user_details, name='admin-user-detail'),
    path('user_details/<int:id>/', user_details, name='user-detail')
]