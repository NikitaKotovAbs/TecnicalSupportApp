import random
import subprocess
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.contrib.auth.hashers import make_password
import subprocess
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
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
                password=make_password(password),  # Хэшируем пароль
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

    try:
        verification = VerificationCode.objects.get(user_id=user_id, code=code)
        user = verification.user
        user.is_active = True  # Активируем пользователя после успешной валидации кода
        user.save()
        verification.delete()  # Удаляем код после успешного подтверждения

        # Генерация токена доступа после успешной верификации
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Пользователь успешно подтвержден",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user_id": user.id
        }, status=status.HTTP_200_OK)

    except VerificationCode.DoesNotExist:
        return Response({"message": "Неверный код подтверждения"}, status=status.HTTP_400_BAD_REQUEST)


def get_logs(request):
    log_file_path = os.path.join(settings.BASE_DIR, 'logs', 'api_requests.log')

    if not os.path.exists(log_file_path):
        return JsonResponse({'status': 'error', 'message': 'Лог-файл не найден'})

    try:
        with open(log_file_path, 'r') as log_file:
            logs = log_file.readlines()[-10:]  # Получаем последние 10 записей лога
        return JsonResponse({'status': 'success', 'logs': logs})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

@csrf_exempt
def backup_database(request):
    try:
        # Путь для бэкапа
        backup_dir = "../backups"
        os.makedirs(backup_dir, exist_ok=True)  # Создаст папку, если она не существует
        backup_file = os.path.join(backup_dir, "backup.sql")

        # Выполнение команды pg_dump для бэкапа базы данных
        command = f"pg_dump -U postgres -h localhost -p 5432 technicalsupport > {backup_file}"
        subprocess.run(command, shell=True, check=True)
        return JsonResponse({"status": "success", "message": "Бэкап выполнен успешно!"})
    except subprocess.CalledProcessError as e:
        # Логирование ошибки
        error_message = f"Ошибка выполнения бэкапа: {str(e)}"
        print(error_message)  # Печать в консоль сервера
        return JsonResponse({"status": "error", "message": error_message})



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
