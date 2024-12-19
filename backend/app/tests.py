from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()


class AuthTests(APITestCase):

    def setUp(self):
        self.username = 'testuser'
        self.password = 'testpassword'
        self.user = User.objects.create_user(username=self.username, password=self.password)

    def test_login_success(self):
        # Тест успешного входа
        response = self.client.post(reverse('token_obtain_pair'), {
            'username': self.username,
            'password': self.password
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_login_failure(self):
        # Тест неудачного входа
        response = self.client.post(reverse('token_obtain_pair'), {
            'username': self.username,
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_access_protected_endpoint(self):
        # Успешный доступ к защищённому эндпоинту с валидным токеном
        login_response = self.client.post(reverse('token_obtain_pair'), {
            'username': self.username,
            'password': self.password
        })
        access_token = login_response.data['access']

        url = reverse('protected_endpoint')
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Bearer {access_token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "This is a protected endpoint!"})

    def test_access_protected_endpoint_without_token(self):
        # Доступ без токена
        url = reverse('protected_endpoint')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_access_protected_endpoint_with_invalid_token(self):
        # Доступ с недействительным токеном
        url = reverse('protected_endpoint')
        invalid_token = 'invalidtoken'
        response = self.client.get(url, HTTP_AUTHORIZATION=f'Bearer {invalid_token}')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
