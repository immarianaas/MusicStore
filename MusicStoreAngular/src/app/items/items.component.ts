import {Component, Input, OnInit} from '@angular/core';
import { Item } from '../item';
import { ItemService } from '../item.service';

import { InstrumentService } from '../instrument.service';
import {Router} from '@angular/router';
import {AuthGuardService} from '../auth-guard.service';
import {Location} from '@angular/common';
import {Manufacturer} from '../manufacturer';
import {AccountService} from '../account.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import {MatFormFieldAppearance} from '@angular/material/form-field';

// import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  // MapPaginator inputs
  length: number;//  = 100;
  pageSize = 6;
  pageSizeOptions: number[] = [6, 12, 18, 24];

  pageEvent: PageEvent;
  activePageDataChunk = [];

  setPageSizeOptions(setPageSizeOptionsInput: string){
    //if (setPageSizeOptionsInput) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    //}
  }

  onPageChanged(e) {
    let firstCut = e.pageIndex * e.pageSize;
    let secondCut = firstCut + e.pageSize;
    this.activePageDataChunk = this.items.slice(firstCut, secondCut);
  }

  items: Item[];
  // instr: Instrument;
  @Input() manufacturer_id: number;
  isInWishlist: Map<number, boolean> = new Map<number, boolean>();

  constructor(private itemService: ItemService,
              private instrService: InstrumentService,
              private accService: AccountService,
              private authService: AuthGuardService,
              private location: Location,
              private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    if (!this.manufacturer_id)
      this.getItems();
    else
      this.getItemsByManufacturer();
    this.fillMapIsInWishlist();
  }

  goBack(): void {
    this.location.back();
  }

  getItems(): void {
    this.itemService.getItems().subscribe(
      items => {
        this.items = items;
        this.length = items.length;
        this.activePageDataChunk = this.items.slice(0, this.pageSize);
      }
    );
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Ok', {duration: 5000, panelClass: ['my-snack-bar']} );
  }


  getItemsByManufacturer(): void {
    this.itemService.getItemsByManufacturer(this.manufacturer_id).subscribe(
      items => {
        this.items = items;
        this.length = items.length;
        this.activePageDataChunk = this.items.slice(0, this.pageSize);

      });
  }

  purchase(id: number): void {
    if (!this.authService.isLogged()) {
      return ;
    }
    this.itemService.purchaseItem(id).subscribe();
    this.openSnackBar('Item added to shopping cart!');
  }

  addWishlist(id: number): void {
    if (!this.authService.isLogged()) return;
    this.itemService.addToWishList(id).subscribe();
    this.openSnackBar('Item added to wishlist!');
    this.isInWishlist.set(id, true);
  }

  remWishList(id: number): void {
    this.accService.removeItemWishlistItemId(id).subscribe();
    this.openSnackBar('Item removed from your wishlist!')
    this.isInWishlist.set(id, false);
  }

  fillMapIsInWishlist(): void {
    // 1o, get wishlist:
    this.accService.getWishlist().subscribe(
      data => {
        for (let w of data.items) {
          this.isInWishlist.set(w.item.id, true);
        }
        console.log('map is set');
        //this.wishlist = data;

      }
    );

  }

}
