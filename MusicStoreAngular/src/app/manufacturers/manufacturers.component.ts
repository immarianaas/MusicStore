import { Component, OnInit } from '@angular/core';

import { Manufacturer } from '../manufacturer';
import { ManufacturerService } from '../manufacturer.service';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manufacturers',
  templateUrl: './manufacturers.component.html',
  styleUrls: ['./manufacturers.component.css']
})

export class ManufacturersComponent implements OnInit {
  manufacturers: Manufacturer[];

  constructor(
    private manufacturerService: ManufacturerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getManufacturers();
  }

  getManufacturers(): void {
    this.manufacturerService.getManufacturers().subscribe(manufacturers => this.manufacturers = manufacturers );
  }

  openSnackBar(): void {
    this.snackBar.open('pls?', 'Ok', {duration: 5000, panelClass: ['my-snack-bar'], verticalPosition: 'bottom', horizontalPosition: 'center'} );
  }

}
