from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import IsAdminUser
from django.shortcuts import get_object_or_404
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        # Add input validation
        if not username or not password:
            return Response(
                {'error': 'Please provide both username and password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)
        if user is not None:
            if not user.is_active: 
                return Response(
                    {'error': 'User account is disabled'},
                    status=status.HTTP_403_FORBIDDEN
                )
                
            tokens = get_tokens_for_user(user)
            return Response(tokens, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Get required fields
        required_fields = ['username', 'email', 'password', 'first_name', 'last_name']
        for field in required_fields:
            if not request.data.get(field):
                return Response(
                    {'error': f'{field} is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Check if username already exists
        if User.objects.filter(username=request.data.get('username')).exists():
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if email already exists
        if User.objects.filter(email=request.data.get('email')).exists():
            return Response(
                {'error': 'Email already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.create_user(
                username=request.data.get('username'),
                email=request.data.get('email'),
                password=request.data.get('password'),
                first_name=request.data.get('first_name'),
                last_name=request.data.get('last_name'),
                city=request.data.get('city'),
                state=request.data.get('state'),
                address=request.data.get('address'),
                phone=request.data.get('phone')
            )

            # Generate tokens for the new user
            tokens = get_tokens_for_user(user)
            
            return Response({
                'message': 'User registered successfully',
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'city': user.city,
                    'state': user.state,
                    'address': user.address,
                    'phone': user.phone
                },
                'tokens': tokens
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

from rest_framework_simplejwt.tokens import RefreshToken


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Attempt to blacklist the token
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except TokenError as e:
            # Handle the case where the token is already blacklisted or invalid
            return Response({"message": "Logout successful (token already invalidated)"}, status=status.HTTP_200_OK)
        except Exception as e:
            # Handle other exceptions
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
 
 
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_details(request, id):
    """
    Custom view to fetch user details by ID.
    """
    user = get_object_or_404(CustomUser, id=id)
    serializer = CustomUserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)
        
@api_view(["GET"])
def admin_user_details(request, id):
    user = get_object_or_404(CustomUser, id=id)
    serializer = CustomUserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)
  
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'is_staff': user.is_staff,
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone': user.phone,
        'city': user.city,
        'state': user.state,
        'address': user.address,
        'is_active': user.is_active,
    }