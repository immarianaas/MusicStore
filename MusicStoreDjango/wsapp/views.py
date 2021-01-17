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
from datetime import datetime

from django.core.mail import send_mail, EmailMessage

import json
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

@api_view(['DELETE'])
@permission_classes((IsAuthenticated, ))
def delete_manufacturer(request, id):
    try:
        manufacturer = Manufacturer.objects.get(id=id)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    manufacturer.delete()

    return Response(status=status.HTTP_204_NO_CONTENT)

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

@api_view(['DELETE'])
@permission_classes((IsAuthenticated, ))
def delete_item(request, id):
    try:
        item = Item.objects.get(id=id)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
@permission_classes((IsAuthenticated, ))
def update_item(request):
    id = request.data['id']
    print(request.data)
    try:
        item = Item.objects.get(id=id)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    ser = ItemSerializer(data=request.data)
    if ser.is_valid():
        print('ser', ser)
        try:
            item.price = ser.validated_data['price']
            instrument = Instrument.objects.get(item=item.instrument.id)
            # instrument.description = request.data['instrument']['description']
            request.data['instrument']['manufacturer'] = request.data['instrument']['manufacturer']['id']
            isntrser = InstrumentSerializer(data=request.data['instrument'])
            print(isntrser)
            if isntrser.is_valid():
                instrument.description = isntrser.validated_data['description']
                instrument.name = isntrser.validated_data['name']
                instrument.category = isntrser.validated_data['category']
                instrument.image = isntrser.validated_data['image']
                instrument.manufacturer_id = isntrser.validated_data['manufacturer']
                instrument.save()
                item.save()
                return Response(status=status.HTTP_202_ACCEPTED)
            else:
                print(isntrser.errors)

        except Exception as e:
            print(e.with_traceback())
            return Response(status=status.HTTP_400_BAD_REQUEST)

    return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
# @permission_classes((IsAuthenticated, ))
def update_manufacturer(request):
    id = request.data['id']
    try:
        manu = Manufacturer.objects.get(pk=id)
    except Exception:
        return Response(status=status.HTTP_404_NOT_FOUND)

    ser = ManufacturerSerializer(manu, data=request.data)
    if ser.is_valid():
        ser.save()
        return Response(ser.data, status=status.HTTP_200_OK)
    return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
# @permission_classes((IsAuthenticated, ))
def add_item(request):
    try:
        request.data['instrument']['manufacturer'] = request.data['instrument']['manufacturer']['id']
        instrser = InstrumentSerializer(data=request.data['instrument'])
        if instrser.is_valid():
            i = instrser.save()
            item = Item.objects.create(instrument=i, price=request.data['price'])
            print(item.id)
            return Response(ItemSerializer(item).data, status=status.HTTP_201_CREATED)
        else:
            print(instrser.errors)
    except Exception as e:
        pass
    return Response(status=status.HTTP_400_BAD_REQUEST)

    #if ser.is_valid():


@api_view(['POST'])
# @permission_classes((IsAuthenticated, ))
def create_manufacturer(request):
    ser = ManufacturerSerializer(data=request.data)
    if ser.is_valid():
        ser.save()
        return Response(ser.data, status=status.HTTP_201_CREATED)
    return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)



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

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def add_to_wishlist(request):
    person = Person.objects.get(user=request.user)
    item = Item.objects.get(pk=request.data)
    if is_item_in_list('wishlist', item, person):
        return Response(status=status.HTTP_400_BAD_REQUEST)

    add_to_list('wishlist', person, item)
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
  
def get_curr_person_object(request):    #     person = Person.objects.get(user=request.user)
    u = models.User.objects.get(pk=request.user.id)
    return Person.objects.get(user=u)

@api_view(['PUT'])
def rem_from_wishlist(request):
    person = Person.objects.get(user=request.user)
    print(request.data)
    item = Item.objects.get(pk=request.data)
    if 'item_id' in request.GET and request.GET['item_id'] == 'true':
        # tenho de ir buscar o item_qty correspondente...
        print('entrou no item_id')
        try:
            il = ItemList.objects.get(type='wishlist', person=person, items__item=item)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        for i in il.items.all():
            if i.item == item:
                i.delete()
                print('apagou no item_id!')
                return Response(status=status.HTTP_202_ACCEPTED)
        print('n encontrou nada no item id :cc')
        return Response(status=status.HTTP_404_NOT_FOUND)

    # id (request.data) -> item_qty_id
    try:
        item_qty = ItemQuantity.objects.get(pk=request.data)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    item_qty.delete()
    return Response(status=status.HTTP_202_ACCEPTED)


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def get_users_account(request):
    p = get_curr_person_object(request)
    return Response(PersonSerializer(p).data)

@api_view(['PUT'])
@permission_classes((IsAuthenticated, ))
def update_account(request):
    id = request.data['id']
    try:
        person = Person.objects.get(id=id)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    ser = PersonUpdateSerializer(data=request.data)
    if ser.is_valid():
        person.name = ser.validated_data['name']
        person.contact = ser.validated_data['contact']
        person.gender = ser.validated_data['gender']
        person.save()
        return Response(ser.data)

    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def get_shopping_cart(request):
    person = Person.objects.get(user=request.user)
    try:
        item_lt = ItemList.objects.get(person=person, type='shoppingcart')
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response(ItemListSerializer(item_lt).data)

@api_view(['PUT'])
@permission_classes((IsAuthenticated, ))
def increment_item_at_cart(request):
    try:
        itemqt = ItemQuantity.objects.get(id=request.data)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    itemqt.quantity +=1
    itemqt.save()

    return Response(status=status.HTTP_202_ACCEPTED)

@api_view(['PUT'])
@permission_classes((IsAuthenticated, ))
def decrement_item_at_cart(request):
    try:
        itemqt = ItemQuantity.objects.get(id=request.data)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    itemqt.quantity -= 1;
    if itemqt.quantity > 0:
        itemqt.save()
    else:
        itemqt.delete()

    return Response(status=status.HTTP_202_ACCEPTED)

@api_view(['PUT'])
@permission_classes((IsAuthenticated, ))
def remove_item_at_cart(request):

    try:
        itemqt = ItemQuantity.objects.get(id=request.data)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    itemqt.delete()

    return Response(status=status.HTTP_202_ACCEPTED)
  
@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def get_wishlist(request):
    try:
        lista = ItemList.objects.get(person=Person.objects.get(user=request.user), type='wishlist')
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response(ItemListSerializer(lista).data)

def sendEmailOnCreate(name, email):
    body = 'Hello ' + name + ', we are very happy to have you associated with us.\n'
    body += 'If you need help don\'t hesitate to contact us on musicstore@null.net, we\'ll always be there for you.\n'
    body += 'At last, thank you for your trust and good shopping ;)'
    email = EmailMessage(
        subject='New account at Music Store!',
        body=body,
        from_email='musicstore@null.net',
        to=[email]
    )
    email.send()

@api_view(['POST'])
def create_account(request):
    recv = request.data
    if 'date_joined' in recv['user']:
        del recv['user']['date_joined']
    try:
        print('here')

        personser = PersonSerializer(data=recv)
        if personser.is_valid():
            u = models.User.objects.create_user(recv['user']['username'], password=recv['user']['password'])

            name = personser.validated_data['name']
            gen = personser.validated_data['gender']
            cont = personser.validated_data['contact']
            role = personser.validated_data['role']
            Person.objects.create(name=name, gender=gen, contact=cont, user=u, role=role)

            sendEmailOnCreate(name, recv['user']['username'])
            return Response(personser.data, status=status.HTTP_201_CREATED)

    except Exception as err:
        print(err.args)
        return Response(err.__str__(), status=status.HTTP_400_BAD_REQUEST)

    return Response(personser.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def get_my_addresses(request):
    acc = Person.objects.get(user=request.user)
    try:
        addrs = Address.objects.filter(person=acc).all()
    except ObjectDoesNotExist :
        addrs = []
        #return []
    return Response(AddressSerializer(addrs, many=True).data)

@api_view(['DELETE'])
@permission_classes((IsAuthenticated, ))
def delete_address(request, id):
    try:
        address = Address.objects.get(id=id);
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    address.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
@api_view(['PUT'])
@permission_classes((IsAuthenticated, ))
def update_address(request):
    id = request.data['id']
    try:
        address = Address.objects.get(id=id)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    ser = AddressSerializer(data=request.data)
    if ser.is_valid():
        address.street = ser.validated_data['street']
        address.city = ser.validated_data['city']
        address.code = ser.validated_data['code']
        address.country = ser.validated_data['country']
        address.door = ser.validated_data['door']
        address.save()
        return Response(ser.data, status=status.HTTP_202_ACCEPTED)
    return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def add_address(request):
    recv = request.data
    ser = AddressSerializer(data=recv)
    print(recv)
    print(ser)
    if ser.is_valid():
        street = ser.validated_data['street']
        city = ser.validated_data['city']
        code = ser.validated_data['code']
        country = ser.validated_data['country']
        door = ser.validated_data['door']
        a = Address.objects.create(street=street, city=city, code=code, country=country, door=door, person=Person.objects.get(user = request.user))
        return Response(AddressSerializer(a).data, status=status.HTTP_201_CREATED)

    return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def check_if_in_wishlist(requests, item_id):
    if not is_item_in_list('wishlist', Item.objects.get(pk=item_id), Person.objects.get(user=requests.user)):
        print('vai dar false..')
        return Response(False)
    print('vai dar true..')
    return Response(True)

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def place_order(request):
    person = Person.objects.get(user=request.user)

    prod_list = ItemList.objects.get(person=person, type='shoppingcart')
    prod_list.type = 'order'
    prod_list.save()

    try:
        order = Order.objects.create(
            person=person,
            delivery_address_id=request.data['address'],
            payment_method=request.data['payment'],
            order_status='PROC',
            list=prod_list,
            payment_time=datetime.now()
        )
    except Exception:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    # enviar mail para o cliente a confirmar compra
    email = EmailMessage(
        subject='Purchase confirmation',
        body=f'We are sending you this email to confirm that your purchase was made! Your purchase has id {order.id}.\nThanks for trusting us ;)',
        from_email='musicstore@null.net',
        to=[request.user]
    )
    email.send()
    return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
def contact_us(request):
    print(request.data)

    # enviar confirmacao
    email = EmailMessage(
        subject='Your message was sent!',
        body="""
        Hello!
        
        The following message: '""" + request.data['message'] + """' with the subject: '""" + request.data['subject'] + """' was received and will be answered as soon as possible.
        
        We hope to hear from you again,
        Music Store
        """,
        from_email='musicstore@null.net',
        to=[request.data['sender']]
    )
    try:
        email.send()
    except Exception as e:
        return Response("Email is invalid." , status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def get_orders(request):
    person = Person.objects.get(user=request.user)

    try:
        orders = Order.objects.filter(person=person)
    except ObjectDoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    return Response(OrderSerializer(orders, many=True).data)

@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def get_all_orders(request):
    return Response(OrderSerializer(Order.objects.all(), many=True).data)

@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def user_app_growth(request):
    users = models.User.objects.all();
    # [{x, y}, {x, y}]
    dates = {}
    for user in users:
        date = str(user.date_joined.date())
        if not date in dates:
            dates[date] = { 'x' : date, 'y' : 1}
        else:
            dates[date]['y'] += 1

        if len(dates) > 29:
            break

    return Response([val for val in dates.values()], status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def capital_growth(request):
    orders = Order.objects.all()

    dates = {}
    for order in orders:
        date = str(order.payment_time.date())

        total = 0
        for item in order.list.items.all():
            total += item.quantity * item.item.price

        if date in dates:
            dates[date]['y'] += total
        else:
            dates[date] = { 'x' : date, 'y' : total}

        if len(dates) > 29:
            break

    return Response([val for val in dates.values()],status.HTTP_200_OK)