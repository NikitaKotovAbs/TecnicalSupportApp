import base64
import io
import random
import sys

import matplotlib
from django.conf import settings
from django.contrib.auth.hashers import make_password
import subprocess
import os

from django.core.management import call_command
from django.http import HttpResponse, JsonResponse
from django.utils.decorators import method_decorator
from rest_framework.exceptions import ValidationError

from .models import Ticket
import csv
from django.db.models import Count
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from matplotlib import pyplot as plt
from rest_framework import viewsets, filters, status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
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

    if not user_id or not code:
        return Response({"message": "user_id и code обязательны"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        verification = VerificationCode.objects.get(user_id=user_id, code=code)
        user = verification.user
        activate_user(user)
        verification.delete()
        tokens = generate_tokens(user)
        return Response({
            "message": "Пользователь успешно подтвержден",
            "access": tokens['access'],
            "refresh": tokens['refresh'],
            "user_id": user.id
        }, status=status.HTTP_200_OK)

    except VerificationCode.DoesNotExist:
        return Response({"message": "Неверный код подтверждения"}, status=status.HTTP_400_BAD_REQUEST)


def activate_user(user):
    user.is_active = True  # Активируем пользователя после успешной валидации кода
    user.save()


def generate_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    }





def get_logs(request):
    log_file_path = os.path.join(settings.BASE_DIR, 'logs', 'api_requests.log')

    if not os.path.exists(log_file_path):
        return JsonResponse({'status': 'error', 'message': 'Лог-файл не найден'})

    try:
        with open(log_file_path, 'r') as log_file:
            logs = log_file.readlines()
        return JsonResponse({'status': 'success', 'logs': logs})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})






@csrf_exempt
def backup_database(request):
    if request.method == 'POST':
        backup_dir = 'backups'
        if not os.path.exists(backup_dir):
            os.makedirs(backup_dir)

        backup_file = os.path.join(backup_dir, f'backup_{timezone.now().strftime("%Y%m%d%H%M%S")}.json')

        try:
            with open(backup_file, 'w') as f:
                subprocess.run([sys.executable, 'manage.py', 'dumpdata', '--indent', '4'], stdout=f)
            return JsonResponse({"status": "success", "message": "Бэкап выполнен успешно!"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Недопустимый метод запроса."}, status=400)





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

# -*- coding: utf-8 -*-


matplotlib.use('Agg')  # Используйте 'Agg' backend для избежания проблем с GUI


class GraphView(APIView):
    def get(self, request, *args, **kwargs):
        data = Ticket.objects.values('category__name').annotate(count=Count('id')).order_by('category__name')
        categories = [item['category__name'] for item in data]
        counts = [item['count'] for item in data]

        plt.figure(figsize=(10, 6))
        plt.bar(categories, counts, color='skyblue')
        plt.title('Количество созданных тикетов по категориям')
        plt.xlabel('Категории')
        plt.ylabel('Количество тикетов')

        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        image_base64 = base64.b64encode(buf.read()).decode('utf-8')
        plt.close()

        return Response({"graph": image_base64}, status=status.HTTP_200_OK)


class TicketStatusGraphView(APIView):
    def get(self, request, *args, **kwargs):
        data = Ticket.objects.values('status').annotate(count=Count('id')).order_by('status')
        statuses = [item['status'] for item in data]
        counts = [item['count'] for item in data]

        plt.figure(figsize=(10, 6))
        plt.pie(counts, labels=statuses, autopct='%1.1f%%', startangle=140, colors=['skyblue', 'orange', 'green'])
        plt.title('Распределение тикетов по статусам')

        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        image_base64 = base64.b64encode(buf.read()).decode('utf-8')
        plt.close()

        return Response({"graph": image_base64}, status=status.HTTP_200_OK)




def export_tickets_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="tickets.csv"'
    response.write('\ufeff'.encode('utf8'))  # Добавляем BOM для правильной кодировки

    writer = csv.writer(response)
    writer.writerow(
        ['ID', 'Title', 'Description', 'Status', 'Priority', 'Created At', 'Updated At', 'Assigned To', 'Created By',
         'Category']
    )

    tickets = Ticket.objects.all()
    for ticket in tickets:
        writer.writerow([
            ticket.id,
            ticket.title,
            ticket.description,
            ticket.status,
            ticket.priority,
            ticket.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            ticket.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
            ticket.assigned_to_id if ticket.assigned_to else '',
            ticket.created_by_id,
            ticket.category_id if ticket.category else ''
        ])

    return response


@csrf_exempt
def import_tickets_csv(request):
    if request.method == 'POST':
        csv_file = request.FILES['file']
        decoded_file = csv_file.read().decode('utf-8').splitlines()
        reader = csv.reader(decoded_file)

        next(reader)  # Пропустить заголовок
        errors = []
        for i, row in enumerate(reader):
            try:
                ticket = Ticket.objects.create(
                    title=row[1],
                    description=row[2],
                    status=row[3],
                    priority=row[4],
                    created_at=row[5],
                    updated_at=row[6],
                    assigned_to_id=row[7] if row[7].isdigit() else None,
                    created_by_id=row[8] if row[8].isdigit() else None,
                    category_id=row[9] if row[9].isdigit() else None
                )
            except ValidationError as e:
                errors.append((i + 2, str(e)))
            except ValueError as e:
                errors.append((i + 2, str(e)))

        if errors:
            return JsonResponse({"status": "error", "errors": errors}, status=400)

        return JsonResponse({"status": "success"})

    return JsonResponse({"status": "error"}, status=400)
