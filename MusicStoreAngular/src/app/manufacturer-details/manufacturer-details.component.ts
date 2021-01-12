import {Component, Input, OnInit} from '@angular/core';
import { Manufacturer } from '../manufacturer';
import { ManufacturerService } from '../manufacturer.service';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {Instrument} from '../instrument';
import {Item} from '../item';
import {AuthGuardService} from '../auth-guard.service';

@Component({
  selector: 'app-manufacturer-details',
  templateUrl: './manufacturer-details.component.html',
  styleUrls: ['./manufacturer-details.component.css']
})
export class ManufacturerDetailsComponent implements OnInit {

  manufacturer: Manufacturer;
  instruments: Item[];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private manufacturersService: ManufacturerService,
    private authService: AuthGuardService
  ) {  }

  ngOnInit(): void {
    this.getManufacturer();
    this.getItemsOfManufacturer();
  }

  goBack(): void {
    this.location.back();
  }

  isAdmin(): boolean {
    return this.authService.isAdminVar();
  }

  getManufacturer(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.manufacturersService.getManufacturer(id).subscribe(manufacturer => this.manufacturer = manufacturer);
  }

  getItemsOfManufacturer(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.manufacturersService.getItemsOfManufacturer(id).subscribe(instruments => this.instruments = instruments);
  }

  delete(id: number): void {
    this.manufacturersService.deleteManufacturer(id).subscribe(() => this.goBack());
  }

}
