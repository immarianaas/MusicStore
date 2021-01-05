import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import {Router, RouterModule, Routes} from '@angular/router';

import { ManufacturersComponent } from './manufacturers/manufacturers.component';
import { ManufacturerDetailsComponent } from './manufacturer-details/manufacturer-details.component';
import { ItemsComponent } from './items/items.component';

const routes: Routes = [
  {path: 'manufacturers', component: ManufacturersComponent},
  {path: 'manufacturers/:id', component: ManufacturerDetailsComponent},
  {path: 'instruments', component: ItemsComponent}
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
