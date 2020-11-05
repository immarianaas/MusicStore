from django import forms
from django.forms import ModelForm
from app.models import *


class CreateAccount(forms.Form):
    email = forms.EmailField(label="email")
    name = forms.CharField(label="name", max_length=100)
    nib = forms.IntegerField()
    OPTIONS = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other / Rather not say')
    ]
    gender = forms.ChoiceField(label="gender", choices=OPTIONS)
    contact = forms.IntegerField(label="contact")

    street = forms.CharField(label="street", max_length=100)
    city = forms.CharField(label="city", max_length=100)
    code = forms.CharField(label="code", max_length=100)
    country = forms.ChoiceField(label="country", choices= COUNTRIES)
    door = forms.IntegerField(label="door no.")
    password = forms.CharField(widget=forms.PasswordInput)



