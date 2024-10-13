from django.contrib import admin
from .models import *
admin.site.register(Ticket)
admin.site.register(TicketHistory)
admin.site.register(Comment)
admin.site.register(TicketCategory)
# Register your models here.