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
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token

from app import views
from wsapp import views as wsviews

from django.contrib.auth import views as auth_views


urlpatterns = [
    path('', views.home, name='home'),
    path('admin/', admin.site.urls),
    path('create-account/', views.create_account, name='create_account'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('account/', views.account, name='account'),
    path('edit/account/', views.edit_account, name='edit_account'),
    path('edit/addresses/', views.edit_addresses, name='edit_addresses'),
    path('add/addresses/', views.add_addresses, name='add_addresses'),
    path('add/addresses/temp/', views.add_addresses_temp, name='add_temp_address'),
    path('logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),
    path('add-manufacturer/', views.add_manufacturer, name='add_manufacturer'),
    path('manufacturers/', views.see_manufacturers, name='see_manufacturers'),
    path('manufacturers/<int:id>', views.see_manufacturers_details, name='manufacturers_details'),

    path('edit/manufacturers/<int:id>', views.edit_manufacturer, name='edit_manufacturer'),
    path('delete/manufacturers/<int:id>', views.delete_manufacturer, name='delete_manufacturer'),

    path('add-instrument/', views.add_item, name='add_instrument'),
    path('instruments/', views.see_instruments, name='see_instruments'),
    path('instruments/<int:id>', views.see_instruments_details, name='instruments_details'),
    path('edit/instruments/<int:id>', views.edit_instrument, name='edit_instrument'),
    path('delete/instruments/<int:id>', views.delete_instrument, name='delete_instrument'),

    path('orders/', views.list_all_orders, name='password_change_done'),
    path('account/shoppingcart/', views.shopping_cart, name='shopping_cart'),
    path('account/wishlist/', views.wishlist, name='wishlist'),
    path('account/placeorder/', views.place_order, name='place_order'),
    path('account/orders/', views.orders, name='orders'),
    path('account/change_password/', auth_views.PasswordChangeView.as_view(template_name='change_pwd.html', success_url='/account/password_change/done/'), name='change_password'),
    path('account/password_change/done/', views.password_changed, name='password_change_done'),

    # --- projeto 2 ---

    path('ws/token-auth/', obtain_jwt_token),
    path('ws/token-refresh/', refresh_jwt_token),

    path('ws/manufacturers', wsviews.get_manufacturers, name='get_manufacturers'),
    path('ws/manufacturers/<int:id>', wsviews.get_manufacturer_by_id, name='get_manufacturers_by_id'),
    path('ws/manufacturers/<int:id>/items', wsviews.get_instruments_by_manufacturer, name='get_instruments_by_manufacturer'),
    path('ws/deletemanufacturer/<int:id>', wsviews.delete_manufacturer, name='delete_manufacturer'),

    path('ws/items', wsviews.get_items, name='get_items'),
    path('ws/items/<int:id>', wsviews.get_item_by_id, name='get_item_by_id'),
    path('ws/purchase', wsviews.purchase, name='purchase'),
    path('ws/deleteitem/<int:id>', wsviews.delete_item, name='delete_item'),
    path('ws/updateitem', wsviews.update_item, name='update_item'),

    # account related:
    path('ws/account', wsviews.get_users_account, name='get_users_account'),
    path('ws/updateaccount', wsviews.update_account, name='update_account '),
    path('ws/shoppingcart', wsviews.get_shopping_cart, name='get_shopping_cart'),
    path('ws/shoppingcart/inc', wsviews.increment_item_at_cart, name='increment_item_at_cart'),
    path('ws/shoppingcart/dec', wsviews.decrement_item_at_cart, name='decrement_item_at_cart'),
    path('ws/shoppingcart/rem', wsviews.remove_item_at_cart, name='remove_item_at_cart'),
    path('ws/placeorder', wsviews.place_order, name='place_order'),
    path('ws/create-account', wsviews.create_account, name='create_account_api'),
    path('ws/addresses', wsviews.get_my_addresses, name='get_my_addresses'),
    path('ws/create-address', wsviews.add_address, name='add_address'),
    path('ws/updateaddress', wsviews.update_address, name='update_address'),
    path('ws/deleteaddress/<int:id>', wsviews.delete_address, name='delete_address'),
    path('ws/wishlist', wsviews.get_wishlist, name='get_wishlist'),
    path('ws/add-to-wishlist', wsviews.add_to_wishlist, name='add_to_wishlist'),
    path('ws/wishlist/rem', wsviews.rem_from_wishlist, name='rem_from_wishlist'),
    path('ws/in-wishlist/<int:item_id>', wsviews.check_if_in_wishlist, name='check_if_in_wishlist'),
    path('ws/orders', wsviews.get_orders, name='get_orders'),
    path('ws/ordersadmin', wsviews.get_all_orders, name='get_all_orders'),

]
