from django.urls import path
from . import views

urlpatterns = [
    # Product paths
    path("products/", views.products, name="products"),
    path("product_details/<slug:slug>/", views.product_detail, name="product_detail"),
    path("product_detail_id/<int:id>/", views.product_detail_id, name="product_detail_id"),
    path('add_products/', views.add_product, name='add_product'),
    path('update_product/<int:id>/', views.update_product, name='update_product'),
    path('delete_product/<int:id>/', views.delete_product, name='delete_product'),
    
    # Product Inventory paths
    path('add_inventory/', views.create_product_inventory, name='create_product_inventory'),
    path('inventories/<int:product_id>/', views.get_inventories, name='get_inventories'),
    path('inventory/<int:id>/', views.get_product_inventory, name='get_product_inventory'),
    path('inventories/', views.list_product_inventories, name='list_product_inventories'),
    path('update_inventory/<int:id>/', views.update_product_inventory, name='update_product_inventory'),
    path('delete_inventory/<int:id>/', views.delete_product_inventory, name='delete_product_inventory'),
        
    # Category paths
    path("categories/", views.categories, name="categories"),
    path('add_category/', views.add_category, name='add_category'),
    path('update_category/<int:id>/', views.update_category, name='update_category'),
    path('delete_category/<int:id>/', views.delete_category, name='delete_category'),
    
    # Cart paths
    path("get_cart_stat/", views.get_cart_stat, name="get_cart_stat"),
    path("get_cart/", views.get_cart, name="get_cart"),
    path("product_in_cart/", views.product_in_cart, name="product_in_cart"),
    path("add_item/", views.add_item, name="add_item"),
    path("update_quantity/", views.update_quantity, name="update_quantity"),
    path("delete_cartitem/", views.delete_cartitem, name="delete_cartitem"),
    
    # User paths
    path("get_username/", views.get_username, name="get_username"),
    
    # Order paths
    path("orders/", views.list_orders, name="list_orders"),
    path("create_order/", views.create_order, name="create_order"),
    path("delete_order/<int:id>", views.delete_order, name="delete_order"),
    path("order_details/<int:id>", views.order_detail, name="order_detail"),
    path('orderviewdeliverydetails/<int:id>/', views.order_delivery_details, name='order-delivery-details'),
    path('orderviewitems/<int:id>/', views.order_items, name='order-items'),
    path('update_order_status/<int:id>/', views.update_order_status, name='update_order_status'),
]