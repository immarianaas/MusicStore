import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import {Router, RouterModule, Routes} from '@angular/router';

import { ManufacturersComponent } from './manufacturers/manufacturers.component';
import { ManufacturerDetailsComponent } from './manufacturer-details/manufacturer-details.component';
import { ItemsComponent } from './items/items.component';
import {ItemDetailsComponent} from './item-details/item-details.component';
import {NoPathExceptionComponent} from './no-path-exception/no-path-exception.component';
import {LoginComponent} from './login/login.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import {ShoppingCartComponent} from './shopping-cart/shopping-cart.component';
import {WishlistComponent} from './wishlist/wishlist.component';
import {PlaceOrderComponent} from './place-order/place-order.component';

const routes: Routes = [
  {path: '', redirectTo: '/instruments', pathMatch: 'full'},
  {path: 'manufacturers', component: ManufacturersComponent},
  {path: 'manufacturers/:id', component: ManufacturerDetailsComponent},
  {path: 'instruments', component: ItemsComponent},
  {path: 'instruments/:id', component: ItemDetailsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'account', component: AccountInfoComponent},
  {path: 'shoppingcart', component: ShoppingCartComponent},
  {path: 'wishlist', component: WishlistComponent},
  {path: 'placeorder', component: PlaceOrderComponent},

  {path: '**', component: NoPathExceptionComponent},

];

/*
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
*/
@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forRoot(routes)
  ]
})

export class AppRoutingModule { }
