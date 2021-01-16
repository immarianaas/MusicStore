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
import {OrdersComponent} from './orders/orders.component';
import {AuthGuardService} from './auth-guard.service';
import {IndexForAdminComponent} from './index-for-admin/index-for-admin.component';
import {GrowthComponent} from './growth/growth.component';
import {CapitalChartComponent} from './capital-chart/capital-chart.component';

const routes: Routes = [
  {path: '', component: IndexForAdminComponent, pathMatch: 'full'},
  {path: 'manufacturers', component: ManufacturersComponent},
  {path: 'manufacturers/:id', component: ManufacturerDetailsComponent},
  {path: 'instruments', component: ItemsComponent},
  {path: 'instruments/:id', component: ItemDetailsComponent},
  {path: 'create-instrument', component: ItemDetailsComponent},
  {path: 'create-manufacturer', component: ManufacturerDetailsComponent},


  {path: 'login', component: LoginComponent},
  {path: 'account', component: AccountInfoComponent, canActivate : [AuthGuardService]},
  {path: 'shoppingcart', component: ShoppingCartComponent, canActivate : [AuthGuardService]},
  {path: 'wishlist', component: WishlistComponent, canActivate : [AuthGuardService]},
  {path: 'placeorder', component: PlaceOrderComponent, canActivate : [AuthGuardService]},
  {path: 'orders', component: OrdersComponent, canActivate : [AuthGuardService]},
  {path: 'growth', component: GrowthComponent, canActivate : [AuthGuardService]},
  {path: 'capitalgrowth', component: CapitalChartComponent, canActivate : [AuthGuardService]},

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
