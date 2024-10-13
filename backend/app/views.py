from django.contrib.auth.hashers import make_password
from django.shortcuts import render
from rest_framework import viewsets, filters, status
from rest_framework.decorators import api_view
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

    if username and password:
        try:
            user = User.objects.create(
                username=username,
                password=make_password(password)  # Хэшируем пароль
            )
            return Response({"id": user.id, "username": user.username}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "Необходимо указать логин и пароль"}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    http_method_names = ['get', 'post', 'put', 'delete', 'head']
    pagination_class = CustomPagination
    # Направление сортировки: 'asc' для по возрастанию, '-desc' для по убыванию
    ordering_fields = ['id', 'name', 'is_deleted']
    search_fields = ['name']
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]