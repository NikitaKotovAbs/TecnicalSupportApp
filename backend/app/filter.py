# class UserFilter(filters.BaseFilterBackend):
#     def filter_queryset(self, request, queryset, view):
#         # Получаем параметры фильтрации из запроса
#         role = request.query_params.get('roles')
#         email = request.query_params.get('email')
#         print(role)
#         # Фильтруем queryset на основе параметров
#         if role:
#             queryset = LogicUser.objects.filter(roles=role)
#         if email:
#             queryset = LogicUser.objects.filter(email=email)
#         if role and email:
#             queryset = LogicUser.objects.filter(email=email, roles=role)
#         print(queryset)
#
#         return queryset