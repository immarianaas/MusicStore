import { Component, OnInit } from '@angular/core';

import { AccountService } from '../account.service';
import {ItemList} from '../itemList';
import { ItemService } from '../item.service';
import {ItemQuantity} from '../ItemQuantity';

import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: ItemList;
  emptyList: boolean;
  remWhenBought: boolean;

  constructor(
    private accService: AccountService,
    private itemService: ItemService,
    private snackBar: MatSnackBar
  ) {
    /* TODO ver se da para por isto guardado mm... */
    this.remWhenBought = false;
    this.emptyList = false;
  }

  ngOnInit(): void {
    this.getWishlist();
  }

  getWishlist(): void {
    this.accService.getWishlist().subscribe( data => {
                                              if (data) {
                                                this.wishlist = data;
                                                this.emptyList = false;
                                              } else {
                                                this.emptyList = true;
                                              }
    });
  }

  removeItem(item_qty_id: number): void {
    this.accService.removeItemWishlistItemId(item_qty_id).subscribe( () => { this.getWishlist();
                                                                             this.openSnackBar('Item removed from your wishlist!');
    });
  }

  addToShoppingCart(item_qty: ItemQuantity): void {
    this.itemService.purchaseItem(item_qty.item.id).subscribe(() => {
      if (this.remWhenBought) {
        this.removeItem(item_qty.item.id);
        this.openSnackBar('Item added to shopping cart & removed from your wishlist!');
      } else {
        this.openSnackBar('Item added to shopping cart!');
      }
    });
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Ok', {duration: 5000, panelClass: ['my-snack-bar']} );
  }


}
