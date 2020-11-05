from django.db import models

from django.contrib.auth import models as auth_models


# Create your models here.

COUNTRIES = [
    ('Europe', (
        ('PT', 'Portugal'),
        ('ES', 'Spain'),
        ('FR', 'France'),
        ('NL', 'The Netherlands'),
        ('EN', 'England')
    )
     ),
    (
        ('America', (
            ('CA', 'Canada'),
            ('US', 'United States of America'),
            ('BR', 'Brazil')
        )
         )
    ),
    (
        ('Africa', (
            ('AL', 'Algeria'),
            ('AN', 'Angola')
        )
         )
    ),
    (
        ('Asia', (
            ('CH', 'China'),
            ('CM', 'Cambodia'),
            ('IN', 'India'),
            ('JA', 'Japan')
        )
         )
    ),
    (
        ('Oceania', (
            ('AU', 'Australia'),
            ('NZ', 'New Zealand'),
            ('PO', 'Polynesia')
        )

         )
    )
]

class Manufacturer(models.Model):

    name = models.CharField(max_length=100)
    country = models.CharField(choices=COUNTRIES, max_length=100)
    # POR AGORA...
    logo = models.URLField()

    def __str__(self):
        return self.name

# -------------------------------------------------------

class Instrument(models.Model):
    instrument_name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    manufacturer_id = models.ForeignKey(Manufacturer, on_delete=models.CASCADE)
    description = models.CharField(max_length=1000)

    # nao sei bem como usar ImageField mas se não resultar
    # tenta-se com outra cena qualquer:
    image = models.URLField()

    def __str__(self):
        return self.category + " " + self.instrument_name

# -------------------------------------------------------

class Item(models.Model):
    instrument_id = models.OneToOneField(Instrument, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.instrument_id

# -------------------------------------------------------

class Address(models.Model):
    street = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    country = models.CharField(choices=COUNTRIES, max_length=100)
    door = models.IntegerField()

    def __str__(self):
        return self.street+", "+self.door+" - "+self.city+" ("+self.country+")"

# -------------------------------------------------------

class Person(models.Model):
    # TODO provavelmente tem de se alterar isto
    # (mas por agora fica)
    name = models.CharField(max_length=100)
    email = models.OneToOneField(auth_models.User, on_delete=models.CASCADE)
    nib = models.PositiveBigIntegerField()
    OPTIONS = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other / Rather not say')
    ]
    gender = models.CharField(choices=OPTIONS, max_length=100)
    # joined ts acho q ele faz automaticamente tmb
    contact = models.PositiveBigIntegerField()
    address = models.ForeignKey(Address, on_delete=models.CASCADE, max_length=100)

    def __str__(self):
        return self.name


class Employee(models.Model):
    employee_id = models.OneToOneField(Person, on_delete=models.CASCADE)
    CHOICES = [
        ('A', 'Admin'),
        ('S', 'Staff')
    ]
    role = models.CharField(choices=CHOICES, max_length=10)

class Order(models.Model):
    person_id = models.ForeignKey(Person, on_delete=models.CASCADE)
    order_ts = models.TimeField()
    delivery_address = models.ForeignKey(Address, on_delete=models.CASCADE)
    payment_time = models.DateTimeField()
    STATUS = [
        ('PROC', 'Processing order'),
        ('DELIV', 'Sent to delivery'),
        ('SENT', 'On its way'),
        ('REC', 'Delivered at the address')
    ]
    order_status = models.CharField(choices= STATUS, max_length=100)


class ProdList(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)


