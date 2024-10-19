import random

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.shortcuts import render
from rest_framework import viewsets, filters, status, generics
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import *
from django_filters.rest_framework import DjangoFilterBackend

from .pagination import CustomPagination
from .serializer import *


# Create your views here.


@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    if username and password and email:
        try:
            user = User.objects.create(
                username=username,
                password=make_password(password), # Хэшируем пароль
                email=email,
                is_active=False
            )
            # Генерация и сохранение кода подтверждения
            verification_code = random.randint(100000, 999999)
            print("Сгенерированный код", verification_code)
            VerificationCode.objects.create(user=user, code=verification_code)

            # Отправка письма с кодом подтверждения
            send_mail(
                'Подтверждение регистрации',
                f'Ваш код подтверждения: {verification_code}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )

            return Response({"id": user.id, "username": user.username}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "Необходимо указать логин, пароль и email"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def verify_code(request):
    user_id = request.data.get('user_id')
    code = request.data.get('code')

    print(user_id, code)

    try:
        verification = VerificationCode.objects.get(user_id=user_id, code=code)
        user = verification.user
        user.is_active = True  # Активируем пользователя после успешной валидации кода
        user.save()
        verification.delete()  # Удаляем код после успешного подтверждения
        return Response({"message": "Пользователь успешно подтвержден"}, status=status.HTTP_200_OK)
    except VerificationCode.DoesNotExist:
        return Response({"message": "Неверный код подтверждения"}, status=status.HTTP_400_BAD_REQUEST)



class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProtectedEndpointView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "This is a protected endpoint!"})


class TicketCategoryViewSet(viewsets.ModelViewSet):
    queryset = TicketCategory.objects.all()
    serializer_class = TicketCategorySerializer
    http_method_names = ['get', 'post', 'put', 'delete', 'head']
    pagination_class = CustomPagination
    # Направление сортировки: 'asc' для по возрастанию, '-desc' для по убыванию
    ordering_fields = ['id', 'name', 'is_deleted']
    search_fields = ['name']
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head']
    pagination_class = CustomPagination
    # Направление сортировки: 'asc' для по возрастанию, '-desc' для по убыванию
    ordering_fields = ['id', 'name', 'is_deleted']
    search_fields = ['name']
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    http_method_names = ['get', 'post', 'patch', 'put', 'delete', 'head']
    pagination_class = CustomPagination
    # Направление сортировки: 'asc' для по возрастанию, '-desc' для по убыванию
    ordering_fields = ['id', 'name', 'is_deleted']
    search_fields = ['name']
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    http_method_names = ['get', 'post', 'put', 'delete', 'head']
    pagination_class = CustomPagination
    # Направление сортировки: 'asc' для по возрастанию, '-desc' для по убыванию
    ordering_fields = ['id', 'name', 'is_deleted']
    search_fields = ['name']
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]

    # def perform_create(self, serializer):
    #     serializer.save(author=self.request.user)  # Устанавливаем автора на текущего аутентифицированного пользователя

# class TicketCreateView(generics.CreateAPIView):
#     queryset = Ticket.objects.all()
#     serializer_class = TicketSerializer
