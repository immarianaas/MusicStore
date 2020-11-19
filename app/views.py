from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from app.forms import *
from django.contrib.auth import models


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

            u = models.User.objects.create_user(email, password=password)
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
    print(list(instrumentos))
    instr_info_completa = { i.id: [i, Item.objects.get(instrument=i)] for i in instrumentos }
    print("info::::", instr_info_completa)

    return render(request, 'manufacturer_details.html', {'manu' : manu, 'prods' : instr_info_completa})
    #return render(request, 'manufacturer_details.html', {'manu' : manu, 'prods' : prods})

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

def see_instruments(request):

    items = Item.objects.all()

    return render(request, 'all_instruments.html', {'items' : items})

def see_instruments_details(request, id):
    inst = Instrument.objects.get(pk=id)

    return render(request, 'instrument_details.html', {'m' : inst})

def edit_instrument(request, id):
    inicial = Instrument.objects.get(pk=id)
    if request.method == 'POST':
        form = InstrumentForm(request.POST, instance=inicial)
        if form.is_valid():
            form.save()
        return redirect('/instruments/' + str(id))

    form = InstrumentForm(instance=inicial)
    return render(request, 'create_instrument.html', {'form' : form})


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


@login_required(login_url='/login/')
def shopping_cart(request):
    user_id = request.user.id
