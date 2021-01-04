import {Component, Input, OnInit} from '@angular/core';
import { Manufacturer } from '../manufacturer';
import { ManufacturerService } from '../manufacturer.service';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-manufacturer-details',
  templateUrl: './manufacturer-details.component.html',
  styleUrls: ['./manufacturer-details.component.css']
})
export class ManufacturerDetailsComponent implements OnInit {

  manufacturer: Manufacturer;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private manufacturersService : ManufacturerService
  ) { }

  ngOnInit(): void {
    this.getManufacturer();
  }

  getManufacturer(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.manufacturersService.getManufacturer(id).subscribe(manufacturer => this.manufacturer = manufacturer);
  }

}
