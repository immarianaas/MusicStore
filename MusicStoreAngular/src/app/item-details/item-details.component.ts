import { Component, OnInit } from '@angular/core';

import { Item } from '../item';
import { ItemService } from '../item.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {AuthGuardService} from '../auth-guard.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AccountService} from '../account.service';
import { MatError } from '@angular/material/form-field';

import { FormControl, FormControlDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {Manufacturer} from '../manufacturer';
import {ManufacturerService} from '../manufacturer.service';


import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService, MessageService} from 'primeng/api';

import { Router } from '@angular/router';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})


export class ItemDetailsComponent implements OnInit {
  item: Item;
  isInWishlist: boolean;
  editVar: boolean;
  manufacturers: Manufacturer[];
  categories: string[] = ['wind', 'strings', 'percussion'];

  creating: boolean;

  priceFormControl = new FormControl('', [
    Validators.required,
    Validators.min(0),
  ]);

  descriptionFormControl = new FormControl('', [
    Validators.required,
  ]);

  nameFormControl = new FormControl('', [
    Validators.required,
  ]);

  urlRegex =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  //urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  //urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

  serialNumberFormControl = new FormControl('', [
    Validators.required,
  ]);

  imageFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(this.urlRegex),
  ]);

  categoryFormControl = new FormControl('', [
    Validators.required,
  ]);

  manufacturerFormControl = new FormControl('', [
    Validators.required,
  ]);


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private itemService: ItemService,
    private authService: AuthGuardService,
    private snackBar: MatSnackBar,
    private accService: AccountService,
    private manuSerivce: ManufacturerService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.editVar = false;
  }


  ngOnInit(): void {
    this.route.url.subscribe(params => {
      this.creating = params[0].path === 'create-instrument';
      console.log(this.creating);
    });

    if (!this.creating) {
      this.getItem();
      if (this.authService.isLoggedVar()) this.isItemInWishlist();
    } else {
      this.item = new Item();
    }
    this.manuSerivce.getManufacturers().subscribe(data => {
      this.manufacturers = data;
    });

  }

  goBack(): void {
    this.location.back();
  }

  isAdmin(): boolean {
    return this.authService.isAdminVar();
  }

  getItem(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.itemService.getItem(id).subscribe(item => this.item = item);
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Ok', {duration: 5000, panelClass: ['my-snack-bar']} );
  }


  purchase(): void {
    if (!this.authService.isLogged()) {
      return ;
    }
    this.itemService.purchaseItem(this.item.id).subscribe();
    this.openSnackBar('Item added to shopping cart!');
  }

  addWishlist(): void {
    if (!this.authService.isLogged()) return;
    this.itemService.addToWishList(this.item.id).subscribe();
    this.openSnackBar('Item added to wishlist!');
    this.isInWishlist = true;

  }

  removeItemFromWishlist(): void {
    this.accService.removeItemWishlistItemId(this.item.id).subscribe();
    this.openSnackBar('Item removed from your wishlist!');
    this.isInWishlist = false;
  }

  isItemInWishlist(): void {
    const item_id = +this.route.snapshot.paramMap.get('id');
    this.itemService.checkIfInWishlist(item_id).subscribe(data => this.isInWishlist = data);
  }

  edit(): void {
    this.editVar = true;
  }

  save(item: Item): void {
    console.log(JSON.stringify(item));
    this.item.instrument.manufacturer = this.manufacturers.filter(x => x.id == this.item.instrument.manufacturer.id)[0];

    if (
      this.item.instrument.description.trim().length != 0
      && this.item.instrument.name.trim().length != 0
      && this.item.price >= 0
      && this.item.instrument.image.trim().length != 0
      && this.item.instrument.manufacturer
      && this.item.instrument.manufacturer.name != null
      && this.item.instrument.category
      && this.item.instrument.nr_serie.trim().length != 0
      && !(this.imageFormControl.invalid)
    ) {
      console.log('entrou');
      if (!this.creating)
        this.itemService.updateItem(item).subscribe(() => {
          this.editVar = false;
          this.openSnackBar('Item was edited successfully!');
        });
      else
        this.itemService.createItem(item).subscribe(data => {
          console.log(JSON.stringify(data));
          this.openSnackBar('Item was created successfully!');
          this.router.navigate(['/instruments/' + data.id]);


        });
    }
  }

  cancel(): void {
    if (!this.creating) {
      this.itemService.getItem(this.item.id).subscribe(item => {
        this.item = item;
        this.editVar = false;
      });
    } else {
      this.goBack();
    }
  }

  reset(): void {
    this.item = new Item();
  }

  deleteItem(itemId: number): void {
    this.itemService.deleteItem(itemId).subscribe( () => {
      this.openSnackBar('Item was deleted successfully!');
      this.goBack();
    });

  }

  confirmDelete(itemId: number) {
    this.confirmationService.confirm({
      message: 'Do you really want to delete this item?',
      header: 'Are you sure?',
      accept: () => {
        this.deleteItem(itemId);
      },
      reject: () => {
        console.log('not to delete after all');
      }
    })
  }


}
