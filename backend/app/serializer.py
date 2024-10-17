from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import *


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        # Проверка аутентификации
        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError("Неверные учетные данные")

        group = user.groups.values_list('name', flat=True).first()  # Возвращаем список имен групп

        # Генерация JWT токенов для пользователя
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.id,
            'username': user.username,
            'groups': group if group else "user"  # Преобразуем QuerySet в список
        }


class TicketCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketCategory
        fields = '__all__'


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

    # def create(self, validated_data):
    #     print("Я ВАОШЁЛ В МЕТОД")
    #     user = self.context['request'].user
    #     if not user.is_authenticated:
    #         raise serializers.ValidationError("Пользователь не аутентифицирован")
    #     validated_data['author'] = user
    #     return super().create(validated_data)
