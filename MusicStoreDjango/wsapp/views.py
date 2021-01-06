from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from wsapp.serializers import *
from django.contrib.auth import models
from django.core.exceptions import ObjectDoesNotExist

# Create your views here.

@api_view(['GET'])
def get_manufacturers(request):
    manus = Manufacturer.objects.all()
    ''' # para o caso de haver argumentos:
        # (este exemplo é para apenas buscar um x 
        # numero de elementos
        
    if 'num' in request.GET:
        num = int(request.GET['num'])
        authors = authors[:num]
    '''
    ser = ManufacturerSerializer(manus, many=True)
    return Response(ser.data)

@api_view(['GET'])
def get_manufacturer_by_id(request, id):
    manu = Manufacturer.objects.get(pk=id)
    return Response(ManufacturerSerializer(manu).data)

# -> apenas permite acederes se estiveres autenticado
# @permission_classes((IsAuthenticated, ))
@api_view(['GET'])
def get_items(request):
    # na página dos instrumentos são 'items' que vão aparecer
    # porque os instrumentos em si não tem conhecimento, por exemplo, do preço
    items = Item.objects.all()
    ser = ItemSerializer(items, many=True)
    if request.user.is_authenticated:
        print('authenticated!!')
    else:
        print(request.user)
        # print(request.META['HTTP_AUTHORIZATION'])
        # print(len(request.META['HTTP_AUTHORIZATION']))
        print('not authenticated!')
    return Response(ser.data)

@api_view(['GET'])
def get_item_by_id(request, id):
    item = Item.objects.get(pk=id)
    print(request.user.is_authenticated)
    return Response(ItemSerializer(item).data)

@api_view(['GET'])
def get_instruments_by_manufacturer(request, id):
    items = Item.objects.filter(instrument__manufacturer__pk=id)
    return Response(ItemSerializer(items, many=True).data)

@api_view(['POST'])
def purchase(request):
    if not request.user.is_authenticated:
        # retornar um http de erro
        pass

    person = Person.objects.get(user=request.user)
    item = Item.objects.get(pk=request.data)
    add_to_list('shoppingcart', person, item)

    ser = ItemSerializer(item)
    return Response(ser.data, status=status.HTTP_201_CREATED)

def is_item_in_list(list_type, item, user):
    try:
        il = ItemList.objects.get(type=list_type, person=user, items__item=item)
    except ObjectDoesNotExist:
        return False
    return il.items

def add_to_list(list_type, person, item):
    try:
        il = ItemList.objects.get(type=list_type, person=person)
    except ObjectDoesNotExist:
        il = ItemList.objects.create(type=list_type, person=person)

    #print("is item in list?? ", is_item_in_list(list_type, item, person))
    ans = is_item_in_list(list_type, item, person)
    if not ans:
        item_qty = ItemQuantity.objects.create(item=item, quantity=1)
        il.items.add(item_qty)
    else:
        item = ans.get(item__exact=item)
        item.quantity = item.quantity+1
        item.save()

    return