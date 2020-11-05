from django.shortcuts import render, redirect
from app.forms import *
from django.contrib.auth import models

# Create your views here.

def home(request):
    return render(request, 'home.html')


def create_account(request):
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

    form = CreateAccount()
    return render(request, 'create_account.html', {'form': form})

