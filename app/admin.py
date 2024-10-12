from django.contrib import admin
from app.models import *
# Register your models here.
admin.site.register(TicketCategory)
admin.site.register(Ticket)
admin.site.register(Comment)
admin.site.register(TicketHistory)
