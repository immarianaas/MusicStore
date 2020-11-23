from django import forms
from django.forms import ModelForm
from app.models import *

class AccountForm(ModelForm):
    class Meta:
        model = Person
        # fields = '__all__' #TODO EXCLUIR user DAQUI!!
        fields = ['name', 'gender', 'contact']

class CreateAccount(forms.Form):
    email = forms.EmailField(label="email")
    password = forms.CharField(widget=forms.PasswordInput)

    name = forms.CharField(label="name", max_length=100)
    gender = forms.ChoiceField(label="gender", choices=GENDER)
    contact = forms.IntegerField(label="contact")
    '''
    # address part...
    street = forms.CharField(label="street", max_length=100)
    city = forms.CharField(label="city", max_length=100)
    code = forms.CharField(label="code", max_length=100)
    country = forms.ChoiceField(label="country", choices= COUNTRIES)
    door = forms.IntegerField(label="door no.")
    '''


class AddressForm(ModelForm):
    class Meta:
        model = Address
        #exclude = ['person']
        fields= '__all__'

'''
class CreateAddressForm(forms.Form):
    street = forms.CharField(max_length=100)
    city = forms.CharField(max_length=100)
    code = forms.CharField(max_length=20)
    country = forms.CharField(choices=COUNTRIES, max_length=100)
    door = forms.IntegerField()
'''


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


class ItemForm(forms.Form):
    price = forms.DecimalField(max_digits=10, decimal_places=2)


class InstrumentForm(ModelForm):
    class Meta:
        model = Instrument
        fields = '__all__'


class InstrumentSlashItemForm(ModelForm):
    price = forms.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = Instrument
        fields = '__all__'

