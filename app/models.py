from django.db import models

from django.contrib.auth import models as auth_models

# Create your models here.

COUNTRIES = [
    ('Europe', (
        ('PT', 'Portugal'),
        ('ES', 'Spain'),
        ('FR', 'France'),
        ('NL', 'The Netherlands'),
        ('EN', 'England'),
        ('DE', 'Germany'),
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

GENDER = [
    ('M', 'Male'),
    ('F', 'Female'),
    ('O', 'Other / Rather not say')
]

INSTRUMENT_CAT = [
    ('wind', 'wind'),
    ('strings', 'strings'),
    ('percussion', 'percussion')
]

LIST_TYPE = [
    ('whishlist', 'wishlist'),
    ('order', 'order'),
    ('shoppingcart', 'shoppingcart')
]

ROLES = [
    ('A', 'Admin'),
    ('S', 'Staff'),
    ('C', 'Customer')
]

STATUS = [
    ('PROC', 'Processing order'),
    ('DELIV', 'Sent to delivery'),
    ('SENT', 'On its way'),
    ('REC', 'Delivered at the address')
]

PAYMENT_METHODS = [
    ('Credit Card', 'Credit Card'),
    ('PayPal', 'PayPal')
]

# not changed
class Manufacturer(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(choices=COUNTRIES, max_length=100)
    # POR AGORA...
    logo = models.URLField()

    def __str__(self):
        return self.name


# -------------------------------------------------------
# not changed (exceto uns nomes)
class Instrument(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(choices=INSTRUMENT_CAT , max_length=100)
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.CASCADE)
    description = models.CharField(max_length=1000)
    nr_serie = models.CharField(max_length=20)

    # nao sei bem como usar ImageField mas se não resultar
    # tenta-se com outra cena qualquer:
    image = models.URLField()

    def __str__(self):
        return self.category + " " + self.name


# -------------------------------------------------------
# not changed (só um nome)
class Item(models.Model):
    instrument = models.OneToOneField(Instrument, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return str(self.instrument.id) + " [price: " + str(self.price) + "]"



# -------------------------------------------------------
# changed!
class Person(models.Model):
    name = models.CharField(max_length=100)
    user = models.OneToOneField(auth_models.User, on_delete=models.CASCADE)
    gender = models.CharField(choices=GENDER, max_length=100)
    contact = models.PositiveBigIntegerField()

    # address = models.ForeignKey(Address, on_delete=models.CASCADE)
    role = models.CharField(choices=ROLES, max_length=10)

    '''
    street = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    country = models.CharField(choices=COUNTRIES, max_length=100)
    door = models.IntegerField()
    '''

    # shopping_cart = models.OneToOneField(ProdList, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


# -------------------------------------------------------
# added:
class ItemQuantity(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField()


# added:
class ItemList(models.Model):
    type = models.CharField(choices=LIST_TYPE, max_length=20)
    items = models.ManyToManyField(ItemQuantity)
    person = models.ForeignKey(Person, on_delete=models.CASCADE)


# -------------------------------------------------------
# deleted.
# class Employee(models.Model):
#     employee_id = models.OneToOneField(Person, on_delete=models.CASCADE)
#     role = models.CharField(choices=ROLES, max_length=10)

# deleted (kind of, passou para ItemList e alterou-se algumas ceninhas)
# class ProdList(models.Model):
#     # order = models.ForeignKey(Order, on_delete=models.CASCADE)
#     user = models.ForeignKey(Person, on_delete=models.CASCADE)
#     list_id = models.IntegerField()
#     item = models.ForeignKey(Item, on_delete=models.CASCADE)
# -------------------------------------------------------


# -------------------------------------------------------
# person added
class Address(models.Model):
    street = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    country = models.CharField(choices=COUNTRIES, max_length=100)
    door = models.IntegerField()

    person = models.ForeignKey(Person, on_delete=models.CASCADE, blank=True)

    def __str__(self):
        return self.street + ", " + str(self.door) + " - " + self.city + " (" + self.country + ")"


# -------------------------------------------------------
# changed.
class Order(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    delivery_address = models.ForeignKey(Address, on_delete=models.CASCADE)
    payment_time = models.DateTimeField()
    order_status = models.CharField(choices=STATUS, max_length=100)
    list = models.ForeignKey(ItemList, on_delete=models.CASCADE)
    payment_method = models.CharField(choices=PAYMENT_METHODS, max_length=20)

    def __str__(self):
        return str(self.person) + str(self.delivery_address) + str(self.payment_time)