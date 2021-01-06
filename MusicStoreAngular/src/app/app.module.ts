import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
