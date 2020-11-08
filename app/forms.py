from django import forms
from django.forms import ModelForm
from app.models import *

class AccountForm(ModelForm):
    class Meta:
        model = Person
        fields = '__all__' #TODO EXCLUIR user DAQUI!!

class CreateAccount(forms.Form):
    email = forms.EmailField(label="email")
    name = forms.CharField(label="name", max_length=100)
    nib = forms.IntegerField()
    gender = forms.ChoiceField(label="gender", choices=OPTIONS)
    contact = forms.IntegerField(label="contact")

    street = forms.CharField(label="street", max_length=100)
    city = forms.CharField(label="city", max_length=100)
    code = forms.CharField(label="code", max_length=100)
    country = forms.ChoiceField(label="country", choices= COUNTRIES)
    door = forms.IntegerField(label="door no.")
    password = forms.CharField(widget=forms.PasswordInput)

'''
class CreateManufacturers(forms.Form):
    name = forms.CharField(label='name', max_length=100)
    country = forms.ChoiceField(label='country', choices=COUNTRIES)
    logo = forms.URLField()
'''
'''
class CreateInstrument(forms.Form):
    instrument_name = forms.CharField(max_length=100)
    categories = [
        ('Sopro', 'Sopro'),
        ('Percução', 'Percução'),
        ('Cordas', 'Cordas')
    ]
    category = forms.ChoiceField(choices=categories)
    manus = Manufacturer.objects.all()
    manu_choices = [(m.id,m.name) for m in manus]
    manufacturer = forms.ChoiceField(choices=manu_choices)
    description = forms.CharField(max_length=1000)
    image = forms.URLField()
'''

class ManufacturerForm(ModelForm):
    class Meta:
        model = Manufacturer
        fields = '__all__'

class InstrumentForm(ModelForm):
    class Meta:
        model = Instrument
        fields = '__all__'