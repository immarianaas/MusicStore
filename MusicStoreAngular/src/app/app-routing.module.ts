import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import {Router, RouterModule, Routes} from '@angular/router';

import { ManufacturersComponent } from './manufacturers/manufacturers.component';

const routes: Routes = [
  {path: 'manufacturers', component: ManufacturersComponent}
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
