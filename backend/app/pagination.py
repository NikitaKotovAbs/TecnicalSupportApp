from rest_framework.pagination import PageNumberPagination


class CustomPagination(PageNumberPagination):
    page_size = 10  # Количество элементов на странице
    page_query_param = 'page'  # Имя параметра запроса для указания номера страницы
    page_size_query_param = 'page_size'  # Имя параметра запроса для указания размера страницы
    max_page_size = 1000  # Максимальное количество элементов на странице