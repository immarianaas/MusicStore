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
            nib = form.cleaned_data['nib']
            gender = form.cleaned_data['gender']
            contact = form.cleaned_data['contact']
            password = form.cleaned_data['password']

            street = form.cleaned_data['street']
            city = form.cleaned_data['city']
            code = form.cleaned_data['code']
            country = form.cleaned_data['country']
            door = form.cleaned_data['door']

            u = models.User.objects.create_user(email, password=password)
            # u.save() # falta meter permissoes...
            address = Address(country=country, city=city, code=code, street=street, door=door)
            address.save()
            person = Person(name=name, user=u, nib=nib, gender=gender, contact=contact, address=address)
            person.save()
            print("já criou as cenas...")
            return redirect("/")
        else:
            print(form.errors)
            print("form is apparently not valid")

    return render(request, 'create_account.html', {'form': form})


@login_required(login_url='/login/')
def account(request):
    user_id = request.user.id
    u = models.User.objects.get(pk=user_id)
    print(u)
    ac = Person.objects.get(user_id=u.id)
    return render(request, 'account_details.html', {'u': u, 'ac':ac})

# TODO meter isto nao so com login mas tambem com permissoes especiais
@login_required(login_url='/login/')
def add_manufacturer(request):
    form = CreateManufacturers()

    if request.method =='POST':
        form = CreateManufacturers(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            country = form.cleaned_data['country']
            logo = form.cleaned_data['logo']
            manu = Manufacturer.objects.create(name=name, country=country, logo=logo)
            manu.save()
            return redirect('/account/')
        else:
            print("form is apparently not valid")
            print(form.errors)

    return render(request, 'create_manufacturer.html', {'form' : form})


def see_manufacturers(request):
    manus = Manufacturer.objects.all()
    return render(request, 'all_manufacturers.html', {'manus' : manus})

def layout(request):
    return render(request, 'layout.html')

def see_manufacturers_details(request, id):
    manu = Manufacturer.objects.get(pk = id)

    prods = Instrument.objects.filter(manufacturer_id=manu.id)

    return render(request, 'manufacturer_details.html', {'manu' : manu, 'prods' : prods})

def add_instrument(request):
    form = CreateInstrument()

    if request.method == 'POST':
        form = CreateInstrument(request.POST)
        if form.is_valid():
            instrument_name = form.cleaned_data['instrument_name']
            manufacturer = form.cleaned_data['manufacturer']
            description = form.cleaned_data['description']
            image = form.cleaned_data['image']
            category = form.cleaned_data['category']

            manu = Manufacturer.objects.get(pk = manufacturer)
            print(manu)
            instr = Instrument.objects.create(category=category, instrument_name=instrument_name, manufacturer_id=manu, description=description, image=image)
            # isto já faz o save
            return redirect('/instruments')
    return render(request, 'create_instrument.html', {'form':form})

def see_instruments(request):
    inst = Instrument.objects.all()

    return render(request, 'all_instruments.html', {'inst' : inst})

def see_instruments_details(request, id):
    inst = Instrument.objects.get(pk=id)

    return render(request, 'instrument_details.html', {'m' : inst})
