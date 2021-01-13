import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { ManufacturersComponent } from './manufacturers/manufacturers.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { ManufacturerDetailsComponent } from './manufacturer-details/manufacturer-details.component';
import { ItemsComponent } from './items/items.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { NoPathExceptionComponent } from './no-path-exception/no-path-exception.component';
import {UserService} from './user.service';
import { LoginComponent } from './login/login.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';

import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import { PlaceOrderComponent } from './place-order/place-order.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { OrdersComponent } from './orders/orders.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { IndexForAdminComponent } from './index-for-admin/index-for-admin.component';
import {SliderModule} from 'primeng/slider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FooterComponent } from './footer/footer.component';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';

@NgModule({
  declarations: [
    AppComponent,
    ManufacturersComponent,
    ManufacturerDetailsComponent,
    ItemsComponent,
    ItemDetailsComponent,
    NoPathExceptionComponent,
    LoginComponent,
    AccountInfoComponent,
    ShoppingCartComponent,
    WishlistComponent,
    PlaceOrderComponent,
    OrdersComponent,
    IndexForAdminComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSliderModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    SliderModule,
    InputSwitchModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule
  ],
  providers: [
    UserService,
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue: { appearance: 'fill' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
