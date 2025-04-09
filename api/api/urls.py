from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include("shop_app.urls")),
    path("", include("core.urls")),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Keep this for token refresh
]

urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)