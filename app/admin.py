from django.contrib import admin
from app.models import *
# Register your models here.

admin.site.register(Manufacturer)
admin.site.register(Instrument)
admin.site.register(Item)
admin.site.register(Address)
admin.site.register(Person)
admin.site.register(Employee)
admin.site.register(Order)
admin.site.register(ProdList)

