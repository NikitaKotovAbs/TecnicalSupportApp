from django.shortcuts import render
from rest_framework import viewsets, filters
from .models import *
from django_filters.rest_framework import DjangoFilterBackend

from .pagination import CustomPagination
from .serializer import *
# Create your views here.


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    http_method_names = ['get', 'post', 'put', 'delete', 'head']
    pagination_class = CustomPagination
    # Направление сортировки: 'asc' для по возрастанию, '-desc' для по убыванию
    ordering_fields = ['id', 'name', 'is_deleted']
    search_fields = ['name']
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]