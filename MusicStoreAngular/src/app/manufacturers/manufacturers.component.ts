import { Component, OnInit } from '@angular/core';

import { Manufacturer } from '../manufacturer';
import { ManufacturerService } from '../manufacturer.service';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-manufacturers',
  templateUrl: './manufacturers.component.html',
  styleUrls: ['./manufacturers.component.css']
})

export class ManufacturersComponent implements OnInit {
  manufacturers: Manufacturer[];

  // MapPaginator inputs
  length: number;//  = 100;
  pageSize = 6;
  pageSizeOptions: number[] = [6, 12, 18, 24];

  pageEvent: PageEvent;
  activePageDataChunk = []

  setPageSizeOptions(setPageSizeOptionsInput: string){
    //if (setPageSizeOptionsInput) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    //}
  }

  onPageChanged(e) {
    let firstCut = e.pageIndex * e.pageSize;
    let secondCut = firstCut+ e.pageSize;
    this.activePageDataChunk = this.manufacturers.slice(firstCut, secondCut);
  }


  constructor(
    private manufacturerService: ManufacturerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getManufacturers();
  }

  getManufacturers(): void {
    this.manufacturerService.getManufacturers().subscribe(
      manufacturers => {
        this.manufacturers = manufacturers;
        this.length = manufacturers.length;
        this.activePageDataChunk = this.manufacturers.slice(0, this.pageSize);
      }
    );
  }

  openSnackBar(): void {
    this.snackBar.open('pls?', 'Ok', {duration: 5000, panelClass: ['my-snack-bar'], verticalPosition: 'bottom', horizontalPosition: 'center'} );
  }

}
