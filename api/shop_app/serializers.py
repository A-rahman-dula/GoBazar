from rest_framework import serializers
from .models import Product, Cart, CartItem, Category, ProductInventory, Order, OrderItem, DeliveryDetails

# Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]

# Product Serializer
class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = Product
        fields = ["id", "name", "slug", "image", "description", "category", "price"]

class DetailedProductSerializer(serializers.ModelSerializer):
    similar_products = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ["id", "name", "price", "slug", "image", "description", "similar_products"]
        
    def get_similar_products(self, product):
        products = Product.objects.filter(category=product.category).exclude(id=product.id)
        serializer = ProductSerializer(products, many=True)
        return serializer.data

# Product Inventory Serializer
from rest_framework import serializers
from .models import ProductInventory

class ProductInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductInventory
        fields = ['id', 'product', 'quantity', 'date_updated'] 



# Cart Item Serializer
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'quantity', 'product', 'total']
    
    def get_total(self, cartitem):
        return cartitem.product.price * cartitem.quantity

# Cart Serializer
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(read_only=True, many=True)
    sum_total = serializers.SerializerMethodField()
    num_of_items = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'cart_code', 'items', 'sum_total', 'num_of_items', 'created_at', 'updated_at']
    
    def get_sum_total(self, cart):
        return sum(item.product.price * item.quantity for item in cart.items.all())
    
    def get_num_of_items(self, cart):
        return sum(item.quantity for item in cart.items.all())

# Simple Cart Serializer
class SimpleCartSerializer(serializers.ModelSerializer):
    num_of_items = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'cart_code', 'num_of_items']
        
    def get_num_of_items(self, cart):
        return sum(item.quantity for item in cart.items.all())

# Order Serializer
        
class OrderSerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField()
    delivery_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'total_amount', 'status', 'created_at', 'updated_at', 'order_items', 'delivery_details']
    
    def get_delivery_details(self, order):
        # Get the first related delivery details, if available
        delivery_details = DeliveryDetails.objects.filter(order=order).first()  # First one is fetched here
        if delivery_details:
            return DeliveryDetailsSerializer(delivery_details).data
        return {}  # Return an empty dictionary instead of None for consistency
    
    def get_order_items(self, order):
        # Get all related order items
        order_items = OrderItem.objects.filter(order=order).all()  # Fetch related order items
        if order_items:
            return OrderItemSerializer(order_items, many=True).data  # Serialize all related order items
        return []  # Return an empty list instead of None

class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product')
    product = ProductSerializer(read_only=True)
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())

    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'product', 'quantity', 'price', 'order']

    
# Delivery Details Serializer
class DeliveryDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryDetails
        fields = ['id', 'order', 'first_name', 'last_name', 'delivery_address', 'city', 'country', 'contact_number', 'email', 'created_at', 'updated_at']