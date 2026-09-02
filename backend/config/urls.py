"""
URL Configuration for WORLD DESIGN project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from apps.products.views import product_og_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('og/products/<slug:slug>/', product_og_view, name='product_og'),
    path('api/auth/', include('apps.users.urls')),
    path('api/products/', include('apps.products.urls')),
    path('api/admin/products/', include('apps.products.admin_urls')),
    path('api/admin/categories/', include('apps.products.admin_categories_urls')),
    path('api/health/', include('apps.health.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
