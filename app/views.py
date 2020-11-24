from datetime import datetime

from django.contrib.auth.decorators import login_required, permission_required
from django.shortcuts import render, redirect
from app.forms import *
from django.contrib.auth import models

from django.core.exceptions import ObjectDoesNotExist


# Create your views here.

def home(request):
    # role = None
    # if request.user.is_authenticated:
    #     role = get_curr_person_object(request).role
    instruments = None
    if not request.user.is_authenticated:
        instruments = Instrument.objects.all();
        instruments = [ (i , False) for i in instruments]
        try:
            #             ItemList.objects.get(person=person, type='whishlist', items__item_id=item.id)
            il = [ i.item for i in ItemList.objects.get(person=get_curr_person_object(request), type='wishlist').items.all()]
            its = [ (i , False) for i in items]
        except ObjectDoesNotExist:
            print("nope, sory")
            pass
        #print(role, role=='S')
    return render(request, 'home.html', {'loggedin': request.user.is_authenticated, 'items' : instruments})

def create_account(request):
    form = CreateAccount()

    if request.method == 'POST':
        form = CreateAccount(request.POST)
        if form.is_valid():

            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            gender = form.cleaned_data['gender']
            contact = form.cleaned_data['contact']
            password = form.cleaned_data['password']
            '''
            street = form.cleaned_data['street']
            city = form.cleaned_data['city']
            code = form.cleaned_data['code']
            country = form.cleaned_data['country']
            door = form.cleaned_data['door']
            '''
            try:
                u = models.User.objects.create_user(email, password=password)
            except Exception:
                # TODO já existe conta c esse email!!!!!!!! (descobrir como meter erros)
                return redirect("/create-account")
            # TODO falta meter permissoes...

            #addr = Address.objects.create(country=country, city=city, code=code, street=street, door=door)
            Person.objects.create(name=name, user=u, gender=gender, contact=contact)

            return redirect("/login")
        else:
            print(form.errors)
            print("form is apparently not valid")

    return render(request, 'create_account.html', {'form': form})


@login_required(login_url='/login/')
def account(request):
    user_id = request.user.id
    u = models.User.objects.get(pk=user_id)
    ac = Person.objects.get(user_id=u.id)
    try:
        addrs = Address.objects.filter(person=ac).all()
    except ObjectDoesNotExist :
        addrs = []
    return render(request, 'account_details.html', {'u': u, 'ac':ac, 'addrs' : addrs})


# TODO meter isto nao so com login mas tambem com permissoes especiais

@login_required(login_url='/login/') #help
@permission_required('app.add_manufacturer', login_url='/login/')
def add_manufacturer(request):
    # form = CreateManufacturers()

    if request.method =='POST':
        form = ManufacturerForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/manufacturers/')
        else:
            print("form is apparently not valid")
            print(form.errors)
    form = ManufacturerForm()
    return render(request, 'create_manufacturer.html', {'form' : form})


def see_manufacturers(request):
    manus = Manufacturer.objects.all()
    return render(request, 'all_manufacturers.html', {'manus' : manus})

def layout(request):
    return render(request, 'layout.html')

def see_manufacturers_details(request, id):
    manu = Manufacturer.objects.get(pk = id)
    instrumentos = Instrument.objects.filter(manufacturer_id=manu.id)

    instr_info_completa = { i.id: [i, Item.objects.get(instrument=i)] for i in instrumentos }

    return render(request, 'manufacturer_details.html', {'manu' : manu, 'prods' : instr_info_completa})


@login_required(login_url='/login/') #help
@permission_required('app.add_item', login_url='/login/')
def add_item(request): # ALTERADO DE add_instrument
    # form = CreateInstrument()

    if request.method == 'POST':
        #form = InstrumentForm(request.POST)
        form = InstrumentSlashItemForm(request.POST)
        # form2 = ItemForm(request.POST)
        if form.is_valid(): # and form2.is_valid():
            price = form.cleaned_data.get('price')
            instr = form.save()
            # print("deu certo!!")

            item = Item.objects.create(instrument=instr, price=price)
            # print(item)
            return redirect('/instruments')
        else:
            print("FORM IS NOT VALID [add_item]")
    #form = InstrumentForm()
    form = InstrumentSlashItemForm()
    #form2 = ItemForm()
    return render(request, 'create_instrument.html', {'form':form}) # 'form2' : form2})


@login_required(login_url='/login/')
def purchase(request, item_id, nextt):
    person = get_curr_person_object(request)
    add_to_list('shoppingcart', person, Item.objects.get(pk=item_id))
    # todo apresentar confirmação de que foi adicionado ao cart
    return redirect(nextt)

# nao sei se se deve dar merge destas 2 funcs, depende de como se faz o aviso..
@login_required(login_url='/login/')
def add_to_wishlist(request, item_id, nextt):
    person = get_curr_person_object(request)
    add_to_list('wishlist', person, Item.objects.get(pk=item_id))
    return redirect(nextt)

@login_required(login_url='/login')
def rem_from_wishlist(request, item_id, nextt):
    whishlist_items = ItemList.objects.get(person=get_curr_person_object(request), type='wishlist').items
    whishlist_items.get(item_id=item_id).delete()
    print(whishlist_items.all())
    return redirect(nextt)


def see_instruments(request):
    items = Item.objects.all()
    if request.method=='POST':
        if 'purchase' in request.POST:
            return purchase(request, request.POST['id'], '/instruments/')
        elif 'add_wishlist' in request.POST:
            add_to_wishlist(request, request.POST['id'], '/instruments/')
        elif 'rem_wishlist' in request.POST:
            rem_from_wishlist(request, request.POST['id'], '/instruments/')
        elif 'search' in request.POST:
            query = request.POST['search']
            items = Item.objects.filter(instrument__name__icontains=query).all()
            # instrument__manufacturer__name__icontains=query

    its = [ (i , False) for i in items]
    if request.user.is_authenticated:
        try:
            #             ItemList.objects.get(person=person, type='whishlist', items__item_id=item.id)
            il = [ i.item for i in ItemList.objects.get(person=get_curr_person_object(request), type='wishlist').items.all()]
            its = [ (i , i in il) for i in items]
        except ObjectDoesNotExist:
            print("nope, sory")
            pass
    return render(request, 'all_instruments.html', {'items' : its})


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


def get_curr_person_object(request):
    u = models.User.objects.get(pk=request.user.id)
    return Person.objects.get(user=u)


def see_instruments_details(request, id):
    item = Item.objects.get(pk=id)

    if request.method == 'POST':
        if 'purchase' in request.POST:
            return purchase(request, item.id, '/instruments/' + str(id))
        elif 'add_wishlist' in request.POST:
            return add_to_wishlist(request, str(id), '/instruments/' + str(id))
        elif 'rem_wishlist' in request.POST:
            return rem_from_wishlist(request, str(id), '/instruments/'+str(id))
    wishlist = False # está na wishlist?
    if request.user.is_authenticated:
        person = get_curr_person_object(request)
        try :
            ItemList.objects.get(person=person, type='wishlist', items__item_id=item.id)
            wishlist = True
        except ObjectDoesNotExist:
            wishlist = False

    return render(request, 'instrument_details.html', {'item' : item, 'wishlist' : wishlist})

@login_required(login_url='/login/') #help
@permission_required('app.change_instrument', raise_exception=True)
def edit_instrument(request, id):
    item = Item.objects.get(pk=id)
    inicial = item.instrument

    if request.method == 'POST':
        form = InstrumentSlashItemForm(request.POST, instance=inicial)
        if form.is_valid():
            price = form.cleaned_data['price']
            instr = form.save()
            item.price=price
            item.save()

        return redirect('/instruments/' + str(id))

    form = InstrumentSlashItemForm(instance=inicial, initial={'price': item.price})
    return render(request, 'create_instrument.html', {'form' : form})

@login_required(login_url='/login/')
def edit_account(request):
    user_id = request.user.id
    u = Person.objects.get(pk = user_id)
    if request.method == 'POST':
        form = AccountForm(request.POST, instance=u)
        if form.is_valid():
            form.save()
            return redirect('/account/')

    form = AccountForm(instance=u)
    return render(request, 'edit_account.html', {'form':form})

def sum_to_item_qty(item_qty, number):
    # if numbrt > 1, increase, if else, decrease
    item_qty.quantity += number
    if item_qty.quantity <= 0:
        item_qty.delete()
    else:
        item_qty.save()



@login_required(login_url='/login/')
def shopping_cart(request):
    user_id = request.user.id
    u = models.User.objects.get(pk=user_id)

    if request.method == 'POST':
        item_qty = ItemQuantity.objects.get(pk=request.POST['id'])

        if 'add' in request.POST:
            sum_to_item_qty(item_qty, 1)
        elif 'sub' in request.POST:
            sum_to_item_qty(item_qty, -1)
        elif 'del' in request.POST:
            item_qty.delete()

    total = 0
    nr_prods = 0
    try:
        lista = ItemList.objects.get(person=Person.objects.get(user=u), type='shoppingcart').items.all()
        for i in lista:
            total += i.quantity * i.item.price
            nr_prods += i.quantity

    except ObjectDoesNotExist:
        ItemList.objects.create(person=Person.objects.get(user=u), type='shoppingcart')
        lista = []
    return render(request, 'shopping_cart.html', { 'lista' : lista , 'total' : total, 'nr_prods':nr_prods})

@login_required(login_url='/login/')
def wishlist(request):
    person = get_curr_person_object(request)
    if 'checked' not in request.session:
        request.session['checked'] = False

    if request.method=='POST':
        if 'rem_when_added_to_cart' in request.POST:
            request.session['checked'] = True
        else:
            request.session['checked'] = False

        item_qty = ItemQuantity.objects.get(pk=request.POST['id'])
        if 'rem' in request.POST:
            item_qty.delete()
        elif 'purchase' in request.POST:
            if request.session['checked']:
                # then remove from this list
                item_qty.delete()
            return purchase(request, item_qty.item.id, '/account/wishlist' )

    nr_prods = 0
    try:
        lista = ItemList.objects.get(person=person, type='wishlist').items.all()
        nr_prods = len(lista)
    except ObjectDoesNotExist:
        lista = []
    return render(request, 'wishlist.html', {'lista': lista, 'nr':nr_prods, 'remove':request.session['checked']})



@login_required(login_url='/login/')
def edit_addresses(request):
    person = get_curr_person_object(request)
    addr = Address.objects.get(pk=int(request.POST['id']))
    # vai ser sempre POST
    if request.method == 'POST':
        if 'edit' in request.POST:
            form = AddressForm(request.POST, instance=addr)
            if form.is_valid():
                new_addr = form.save()
                return redirect('/account/')
        elif 'rem' in request.POST:
            addr.delete()
            return redirect('/account/')
        else:
            form = AddressForm(instance=addr)

    return render(request, 'edit_addresses.html', {'form':form, 'operacao' : 'edit', 'person' : get_curr_person_object(request), 'id' : request.POST['id']})

@login_required(login_url='/login/')
def add_addresses(request):
    return add_addresses2(request)

@login_required(login_url='/login/')
def add_addresses_temp(request):
    return add_addresses2(request, temp_addr=True)

def add_addresses2(request, temp_addr=False):
    if 'POST' in request.method:
        form = AddressForm(request.POST)
        if form.is_valid():
            addr = form.save()
            if temp_addr:
                addr.person = None
                addr.save()
                if 'temp_addr' not in request.session:
                    request.session['temp_addr'] = []
                request.session['temp_addr'].append(addr.id)
                return redirect('/account/placeorder', new_addr=addr.id)
            return redirect('/account/')

    form = AddressForm()
    return render(request, 'edit_addresses.html', {'form' : form, 'operacao' : 'add', 'person' : get_curr_person_object(request)})


@login_required(login_url='/login/')
def orders(request):
    try:
        ords = Order.objects.filter(person=get_curr_person_object(request))
    except ObjectDoesNotExist:
        ords= []
    return render(request, 'show_orders.html', {'orders' : ords} )


@login_required(login_url='/login/')
def place_order(request, new_addr=False):

    if request.method == 'POST':
        #if 'new_addr' in request.POST:
        #    #return add_addresses(request, temp_addr=True)
        #
        # return redirect('/add/addresses/temp/')
        if 'address' in request.POST:
            request.session['chosen_addr'] = request.POST['address']
            print(request.POST['address'])
            if 'pay' in request.POST:

                # ver se é pra guardar ou nao os temp_addr
                if 'save_temp_addrs' in request.POST and 'temp_addr' in request.session:
                    for idd in request.session['temp_addr']:
                        adr = Address.objects.get(pk=idd)
                        adr.person = get_curr_person_object(request)
                        adr.save()

                request.session['temp_addr'] = []
                prod_list =ItemList.objects.get(person=get_curr_person_object(request), type='shoppingcart')

                prod_list.type='order'
                prod_list.save()

                # criar order
                ord=Order.objects.create(person=get_curr_person_object(request),
                                     delivery_address_id=request.POST['address'],
                                     payment_method= request.POST['pay'],
                                     order_status='PROC',
                                     list=prod_list,
                                     payment_time= datetime.now()
                                     )
                print(ord)
                return render(request, 'order_completed.html', {'order_id' : ord.id})


    # review order part
    total = 0
    nr_prods = 0
    try:
        lista = ItemList.objects.get(person=get_curr_person_object(request), type='shoppingcart').items.all()
    except:
        return redirect("/instruments/")

    for i in lista:
        total += i.quantity * i.item.price
        nr_prods += i.quantity

    if nr_prods == 0:
        return redirect('/account/shoppingcart')

    info = {'prod_list' : lista, 'total' : total, 'nr_prods' : nr_prods}
    # ------------------
    # escolher address

    # TODO verificar se existe ou nao..
    try:
        addr_choices = Address.objects.filter(person=get_curr_person_object(request)).all()
    except:
        addr_choices = []

    info['addr_choices'] = addr_choices

    return render(request, 'place_order.html', info)

@login_required(login_url='/login/')
def password_changed(request):
    return render(request, 'pwd_succ_changed.html')

def password_change_done(request):
    return render(request, 'pwd_succ_changed.html')

@login_required(login_url='/login/')
@permission_required('app.delete_instrument', raise_exception=True)
def delete_instrument(request, id):
    try:
        Item.objects.get(pk=id).delete()
    except:
        return redirect("/")
    return redirect("/instruments")


@login_required(login_url='/login/')
@permission_required('app.delete_instrument', raise_exception=True)
def delete_manufacturer(request, id):
    try:
        Manufacturer.objects.get(pk=id).delete()
    except:
        return redirect("/")
    return redirect("/manufacturers")

@login_required(login_url='/login/')
@permission_required('app.delete_instrument', raise_exception=True)
def edit_manufacturer(request, id):
    try:
        manu = Manufacturer.objects.get(pk=id)
    except:
        return redirect("/")
    if request.method == 'POST':
        form = ManufacturerForm(request.POST, instance=manu)
        form.save()
        return redirect('/manufacturers/' + str(manu.id))
    form = ManufacturerForm(instance=manu)
    return render(request, 'edit_manufacturer.html', {'form' : form})

@login_required(login_url='/login/')
@permission_required('app.delete_order', raise_exception=True)
def list_all_orders(request):
    try:
        ords = Order.objects.all()
    except ObjectDoesNotExist:
        ords = []

    return render(request, 'all_orders.html', {'orders' : ords})


