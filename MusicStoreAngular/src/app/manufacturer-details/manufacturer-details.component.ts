import {Component, Input, OnInit} from '@angular/core';
import { Manufacturer } from '../manufacturer';
import { ManufacturerService } from '../manufacturer.service';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {Instrument} from '../instrument';
import {Item} from '../item';
import {AuthGuardService} from '../auth-guard.service';
import {FormControl, Validators} from '@angular/forms';

import { COUNTRIES } from '../COUNTRIES';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'app-manufacturer-details',
  templateUrl: './manufacturer-details.component.html',
  styleUrls: ['./manufacturer-details.component.css']
})
export class ManufacturerDetailsComponent implements OnInit {

  manufacturer: Manufacturer;
  instruments: Item[];

  editing: boolean;
  COUNTRIES: any = COUNTRIES;
  creating: boolean;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private manufacturersService: ManufacturerService,
    private authService: AuthGuardService,
    private snackBar: MatSnackBar,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.editing = false;
    this.creating = false;
  }

  nameFormControl = new FormControl('', [
    Validators.required,
  ]);

  imageFormControl = new FormControl('', [
    Validators.required,
  ]);

  countryFormControl = new FormControl('', [
    Validators.required,
  ]);


  ngOnInit(): void {
    this.route.url.subscribe(params => {
      this.creating = params[0].path === 'create-manufacturer';
    });
    if (!this.creating) {
      this.getManufacturer();
      this.getItemsOfManufacturer();
    } else {
      this.manufacturer = new Manufacturer();
    }

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
    this.manufacturersService.deleteManufacturer(id).subscribe(() => {
      this.openSnackBar('Manufacturer deleted successfully!');
      this.goBack();
    });
  }

  edit(): void {
    this.editing = true;
  }

  save(): void {
    if (
      this.manufacturer.country
      && this.manufacturer.country.trim() !== ''
      && this.manufacturer.name.trim() !== ''
      && this.manufacturer.logo.trim() !== ''
    ) {
      if (this.editing) {
        this.manufacturersService.updateManufacturer(this.manufacturer).subscribe(
          data => {
            this.manufacturer = data;
            this.editing = false;
            this.openSnackBar('Manufacturer edited successfully!');

          }, error => {
            console.log(error.error);
          }
        );
      } else if (this.creating) {
        this.manufacturersService.createManufacturer(this.manufacturer).subscribe(
          data => {
            this.manufacturer = data;
            this.creating = false;
            this.openSnackBar('Manufacturer created successfully!');
          },
          error => {
            console.log(error.error);
          }
        );
      }
    }
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Ok', {duration: 5000, panelClass: ['my-snack-bar']} );
  }



  reset(): void {
    this.manufacturer = new Manufacturer();
  }

  cancel(): void {
    if (!this.creating) {
      this.editing = false;
      this.getManufacturer();
    } else {
      this.creating = false;
      this.goBack();
    }
  }


  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Do you really want to delete this manufacturer, and all of its items?',
      header: 'Are you sure?',
      accept: () => {
        this.delete(id);
      },
      reject: () => {
        console.log('not to delete after all');
      }
    });
  }





}
