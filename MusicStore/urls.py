"""MusicStore URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
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
from django.urls import path

from app import views

from django.contrib.auth import views as auth_views


urlpatterns = [
    path('', views.home, name='home'),
    path('admin/', admin.site.urls),
    path('create-account/', views.create_account, name='create_account'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('account/', views.account, name='account'),
    path('edit/account/', views.edit_account, name='edit_account'),
    path('logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),
    path('add-manufacturer/', views.add_manufacturer, name='add_manufacturer'),
    path('manufacturers/', views.see_manufacturers, name='see_manufacturers'),
    path('manufacturers/<int:id>', views.see_manufacturers_details, name='manufacturers_details'),
    path('add-instrument/', views.add_item, name='add_instrument'),
    path('instruments/', views.see_instruments, name='see_instruments'),
    path('instruments/<int:id>', views.see_instruments_details, name='instruments_details'),
    path('edit/instruments/<int:id>', views.edit_instrument, name='edit_instrument'),
    path('account/shoppingcart/', views.shopping_cart, name='shopping_cart'),
    # path('account/placeorder/', views.place_order, name='place_order')
]
