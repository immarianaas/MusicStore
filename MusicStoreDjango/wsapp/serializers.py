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

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ( 'id', 'name', 'user', 'gender', 'contact', 'role' )
        depth = 1

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
        fields = ( 'id', 'street', 'city', 'code', 'country', 'door', 'person' )

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ( 'id', 'person', 'delivery_address', 'payment_time', 'order_status', 'list', 'payment_method' )



