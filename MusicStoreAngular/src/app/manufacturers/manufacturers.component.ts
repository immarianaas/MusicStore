import { Component, OnInit } from '@angular/core';

import { Manufacturer } from '../manufacturer';
import { ManufacturerService } from '../manufacturer.service';

@Component({
  selector: 'app-manufacturers',
  templateUrl: './manufacturers.component.html',
  styleUrls: ['./manufacturers.component.css']
})

export class ManufacturersComponent implements OnInit {
  manufacturers: Manufacturer[];

  constructor(private manufacturerService: ManufacturerService) { }

  ngOnInit(): void {
    this.getManufacturers();
  }

  getManufacturers(): void {
    this.manufacturerService.getManufacturers().subscribe(manufacturers => this.manufacturers = manufacturers );
  }

}
