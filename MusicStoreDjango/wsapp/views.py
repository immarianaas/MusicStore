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