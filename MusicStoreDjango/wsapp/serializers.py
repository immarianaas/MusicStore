from app.models import *;
from rest_framework import serializers


class ManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manufacturer
        fields = ('id', 'name', 'country', 'logo' )

class InstrumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instrument
        fields = ('id', 'name', 'category', 'manufacturer', 'description', 'nr_serie', 'image' )

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('id', 'instrument', 'price' )
        depth=2

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = auth_models.User
        fields = ('username', 'date_joined')

class PersonUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('name', 'contact', 'gender')

class PersonSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Person
        fields = '__all__'

class ItemQuantitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemQuantity
        fields = ( 'id', 'item', 'quantity' )
        depth = 3

class ItemListSerializer(serializers.ModelSerializer):
    items = ItemQuantitySerializer(many=True, read_only=True)
    class Meta:
        model = ItemList
        fields = '__all__'

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        # fields = ( 'id', 'street', 'city', 'code', 'country', 'door', 'person' )

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ( 'id', 'person', 'delivery_address', 'payment_time', 'order_status', 'list', 'payment_method' )



