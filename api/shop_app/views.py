from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import Product, Cart, CartItem, Category, ProductInventory, Order, OrderItem, DeliveryDetails
from .serializers import (
    CategorySerializer, ProductSerializer, DetailedProductSerializer, CartItemSerializer,
    SimpleCartSerializer, CartSerializer, ProductInventorySerializer, OrderSerializer, DeliveryDetailsSerializer,OrderItemSerializer
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.files.storage import default_storage
from django.db.models import Max
from django.http import JsonResponse



# Create your views here.

# Category views
@api_view(["GET"])
def categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def add_category(request):
    if request.method == "POST":
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT"])
def update_category(request, id):
    try:
        category = Category.objects.get(id=id)
    except Category.DoesNotExist:
        return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = CategorySerializer(category, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
def delete_category(request, id):
    try:
        category = Category.objects.get(id=id)
    except Category.DoesNotExist:
        return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

    category.delete()
    return Response({"message": "Category deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# Product views
@api_view(["GET"])
def products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def add_product(request):
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
def delete_product(request, id):
    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    if product.image:
        image_path = product.image.path
        if default_storage.exists(image_path):
            default_storage.delete(image_path)

    product.delete()
    return Response({"message": "Product deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(["PUT", "PATCH"])
def update_product(request, id):
    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(product, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def product_detail(request, slug):
    try:
        product = Product.objects.get(slug=slug)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = DetailedProductSerializer(product)
    return Response(serializer.data)

@api_view(["GET"])
def product_detail_id(request, id):
    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = DetailedProductSerializer(product)
    return Response(serializer.data)

# Product Inventory views
@api_view(['POST'])
def create_product_inventory(request):
    # Ensure that 'product' is in the request data
    if 'product' not in request.data:
        return Response({"error": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = ProductInventorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ProductInventory
from .serializers import ProductInventorySerializer

@api_view(['GET'])
def list_product_inventories(request):
    product_id = request.query_params.get('product_id')
    if not product_id:
        return Response({"error": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    inventories = ProductInventory.objects.filter(product_id=product_id)
    serializer = ProductInventorySerializer(inventories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_inventories(request, product_id):
    inventories = ProductInventory.objects.filter(product_id=product_id)
    
    if not inventories.exists():
        return Response({"error": "No inventory found for this product"}, status=404)
    
    serializer = ProductInventorySerializer(inventories, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
def update_product_inventory(request, id):
    try:
        inventory = ProductInventory.objects.get(id=id)
    except ProductInventory.DoesNotExist:
        return Response({"error": "Inventory not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductInventorySerializer(inventory, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_product_inventory(request, id):
    try:
        inventory = ProductInventory.objects.get(id=id)
    except ProductInventory.DoesNotExist:
        return Response({"error": "Inventory not found"}, status=status.HTTP_404_NOT_FOUND)

    inventory.delete()
    return Response({"message": "Inventory deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def get_product_inventory(request, id):
    try:
        # Fetch all inventory items for the given product id
        inventories = ProductInventory.objects.filter(product_id=id)
        
        # If no inventory is found, return 0 quantity
        if not inventories.exists():
            return JsonResponse({"quantity": 0})
        
        # If inventories exist, sum the quantity
        total_quantity = sum(inventory.quantity for inventory in inventories)
        return JsonResponse({"quantity": total_quantity})
        
    except ProductInventory.DoesNotExist:
        return JsonResponse({"quantity": 0}, status=404)




# Cart views
@api_view(["GET"])
def get_cart_stat(request):
    cart_code = request.GET.get("cart_code")
    try:
        cart = Cart.objects.get(cart_code=cart_code, paid=False)
    except Cart.DoesNotExist:
        return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = SimpleCartSerializer(cart)
    return Response(serializer.data)

@api_view(["GET"])
def get_cart(request):
    cart_code = request.GET.get("cart_code")
    try:
        cart = Cart.objects.get(cart_code=cart_code, paid=False)
    except Cart.DoesNotExist:
        return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(["GET"])
def product_in_cart(request):
    cart_code = request.GET.get("cart_code")
    product_id = request.GET.get('product_id')

    try:
        cart = Cart.objects.get(cart_code=cart_code)
        product = Product.objects.get(id=product_id)
    except (Cart.DoesNotExist, Product.DoesNotExist):
        return Response({"error": "Cart or Product not found"}, status=status.HTTP_404_NOT_FOUND)

    product_exists_in_cart = CartItem.objects.filter(cart=cart, product=product).exists()
    return Response({'product_in_cart': product_exists_in_cart})

@api_view(["POST"])
def add_item(request):
    try:
        cart_code = request.data.get("cart_code")
        product_id = request.data.get('product_id')

        cart, created = Cart.objects.get_or_create(cart_code=cart_code)
        product = Product.objects.get(id=product_id)
        cartitem, created = CartItem.objects.get_or_create(cart=cart, product=product)
        cartitem.quantity = 1
        cartitem.save()

        serializer = CartItemSerializer(cartitem)
        return Response({'data': serializer.data, 'message': 'Cartitem created successfully'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(["PATCH"])
def update_quantity(request):
    try:
        cartitem_id = request.data.get("item_id")
        quantity = request.data.get('quantity')
        quantity = int(quantity)

        cartitem = CartItem.objects.get(id=cartitem_id)
        cartitem.quantity = quantity
        cartitem.save()

        serializer = CartItemSerializer(cartitem)
        return Response({'data': serializer.data, 'message': 'Cartitem updated successfully'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(["POST"])
def delete_cartitem(request):
    cartitem_id = request.data.get("item_id")
    try:
        cartitem = CartItem.objects.get(id=cartitem_id)
    except CartItem.DoesNotExist:
        return Response({"error": "CartItem not found"}, status=status.HTTP_404_NOT_FOUND)

    cartitem.delete()
    return Response({'message': 'Item deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

# User views
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_username(request):
    user = request.user
    return Response({"username": user.username})

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'is_staff': user.is_staff
    }

# Order views
@api_view(["GET"])
def list_orders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
    print("Request Data:", request.data)  # Log the incoming request data
    user = request.user

    order_data = request.data.get("order", {})
    order_items_data = request.data.get("order_items", [])
    delivery_details_data = request.data.get("delivery_details", {})

    # Get the last order ID before proceeding (if any)
    last_order = Order.objects.aggregate(Max('id'))
    last_order_id = last_order['id__max'] if last_order['id__max'] else 0  # Start from 1 if no previous orders
    print(f"Last Order ID: {last_order_id}")  # Log the last order ID

    # Increment the order ID for the new order
    new_order_id = last_order_id + 1
    print(f"New Order ID: {new_order_id}")  # Log the new order ID

    # Validate that the 'order' field is present and not empty
    if not order_data:
        print("Error: 'order' field is missing or empty")  # Log the error
        return Response(
            {"error": {"order": ["This field is required."]}},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Add the user and new order ID to the order data
    order_data["user"] = user.id
    order_data["id"] = new_order_id  # Set the custom order ID before saving

    # Validate and save the order
    order_serializer = OrderSerializer(data=order_data)
    if not order_serializer.is_valid():
        print("Order Validation Errors:", order_serializer.errors)  # Log validation errors
        return Response(
            {"error": order_serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Save the order
    order = order_serializer.save()

    # Now assign the newly created order ID to the order items
    for item in order_items_data:
        item["order"] = order.id  # Assign the actual order ID to each item

    # Validate and save the delivery details
    delivery_details_data["order"] = order.id
    delivery_details_serializer = DeliveryDetailsSerializer(data=delivery_details_data)
    if not delivery_details_serializer.is_valid():
        print("Delivery Details Validation Errors:", delivery_details_serializer.errors)  # Log validation errors
        order.delete()  # Rollback order creation if delivery details fail
        return Response(
            {"error": delivery_details_serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Save the delivery details
    delivery_details_serializer.save()

    # Validate and save the order items
    order_items_serializer = OrderItemSerializer(data=order_items_data, many=True)
    if not order_items_serializer.is_valid():
        print("Order Items Validation Errors:", order_items_serializer.errors)  # Log validation errors
        order.delete()  # Rollback order creation if order items fail
        return Response(
            {"error": order_items_serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Save the order items
    order_items_serializer.save()

    # Return the response
    return Response(
        {
            "order": order_serializer.data,
            "order_items": order_items_serializer.data,
            "delivery_details": delivery_details_serializer.data,
            "last_order_id": last_order_id  # Include the last order ID in the response
        },
        status=status.HTTP_201_CREATED,
    )
    
@api_view(["PATCH"])
def update_order_status(request, id):
    try:
        status = request.data.get("status")
        if not status:
            return Response({'error': 'Status is required'}, status=400)

        order = Order.objects.get(id=id)
        order.status = status
        order.save()

        serializer = OrderSerializer(order)  # Serialize the Order model
        return Response({'data': serializer.data, 'message': 'Order updated successfully'}, status=200)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)
    except Exception as e:
        print(f"Error: {str(e)}")
        return Response({'error': str(e)}, status=500)

    
@api_view(["DELETE"])
def delete_order(request, id):
    try:
        order = Order.objects.get(id=id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    order.delete()
    return Response({"message": "Order deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def order_detail(request, id):
    try:
        order = Order.objects.get(id=id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = OrderSerializer(order)
    return Response(serializer.data)  


from .serializers import DeliveryDetailsSerializer

@api_view(["GET"])
def order_delivery_details(request, id):
    try:
        order = Order.objects.get(id=id)
        delivery_details = order.delivery_details
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
    except DeliveryDetails.DoesNotExist:
        return Response({"error": "Delivery details not found for this order"}, status=status.HTTP_404_NOT_FOUND)

    serializer = DeliveryDetailsSerializer(delivery_details)
    return Response(serializer.data)


@api_view(["GET"])
def order_items(request, id):
    items = OrderItem.objects.filter(order_id=id)
    serializer = OrderItemSerializer(items, many=True)
    return Response(serializer.data)