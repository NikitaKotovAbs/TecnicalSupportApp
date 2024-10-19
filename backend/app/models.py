from django.db import models
from django.contrib.auth.models import User


class VerificationCode(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

# Модель категории тикетов
class TicketCategory(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название категории")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Категория тикетов"
        verbose_name_plural = "Категории тикетов"


# Модель тикетов
class Ticket(models.Model):
    STATUS_CHOICES = [
        ('open', 'Открыта'),
        ('in_progress', 'В процессе'),
        ('closed', 'Закрыта'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Низкий'),
        ('medium', 'Средний'),
        ('high', 'Высокий'),
        ('urgent', 'Срочный'),
    ]

    title = models.CharField(max_length=200, verbose_name="Название заявки")
    description = models.TextField(verbose_name="Описание проблемы")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open', verbose_name="Статус")
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium', verbose_name="Приоритет")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets', verbose_name="Ответственный")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tickets', verbose_name="Автор заявки")
    category = models.ForeignKey(TicketCategory, on_delete=models.SET_NULL, null=True, verbose_name="Категория")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Тикет"
        verbose_name_plural = "Тикеты"


# Модель комментариев к тикетам
class Comment(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comments', verbose_name="Тикет")
    author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Автор")
    content = models.TextField(verbose_name="Текст комментария")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    def __str__(self):
        return f'Комментарий от {self.author} к {self.ticket}'

    class Meta:
        verbose_name = "Комментарий"
        verbose_name_plural = "Комментарии"


# Модель истории изменений тикетов
class TicketHistory(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='history', verbose_name="Тикет")
    changed_by = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Кто изменил")
    change_type = models.CharField(max_length=255, verbose_name="Тип изменения")
    changed_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата изменения")

    def __str__(self):
        return f'Изменение {self.change_type} для тикета {self.ticket}'

    class Meta:
        verbose_name = "История изменений"
        verbose_name_plural = "История изменений"
