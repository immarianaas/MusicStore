from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from app.forms import *
from django.contrib.auth import models

from django.core.exceptions import ObjectDoesNotExist


# Create your views here.

def home(request):
    return render(request, 'home.html', {'loggedin': request.user.is_authenticated})


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

            street = form.cleaned_data['street']
            city = form.cleaned_data['city']
            code = form.cleaned_data['code']
            country = form.cleaned_data['country']
            door = form.cleaned_data['door']
            try:
                u = models.User.objects.create_user(email, password=password)
            except Exception:
                # TODO já existe conta c esse email!!!!!!!! (descobrir como meter erros)
                return redirect("/create-account")
            # TODO falta meter permissoes...

            addr = Address.objects.create(country=country, city=city, code=code, street=street, door=door)
            Person.objects.create(name=name, user=u, gender=gender, contact=contact, address=addr)

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
    return render(request, 'account_details.html', {'u': u, 'ac':ac})


# TODO meter isto nao so com login mas tambem com permissoes especiais
@login_required(login_url='/login/')
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


@login_required(login_url='/login/')
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

def see_instruments(request):
    items = Item.objects.all()
    if request.method=='POST':
        if 'purchase' in request.POST:
            return purchase(request, request.POST['id'], '/instruments/')
        elif 'wishlist' in request.POST:
            return add_to_wishlist(request, request.POST['id'], '/instruments/')
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
        elif 'wishlist' in request.POST:
            return add_to_wishlist(request, str(id), '/instruments/' + str(id))

    wishlist = False # está na wishlist?
    if request.user.is_authenticated:
        person = get_curr_person_object(request)
        try :
            ItemList.objects.get(person=person, type='wishlist', items__item_id=item.id)
            wishlist = True
        except ObjectDoesNotExist:
            wishlist = False

    return render(request, 'instrument_details.html', {'item' : item, 'wishlist' : wishlist})

@login_required(login_url='/login/')
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
    # TODO cenas pra alterar a pwd (cenas do Django)
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
        lista = ItemList.objects.create(person=Person.objects.get(user=u), type='shoppingcart')

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




