import { Component, OnInit } from '@angular/core';

import { Item } from '../item';
import { ItemService } from '../item.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {AuthGuardService} from '../auth-guard.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AccountService} from '../account.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  item: Item;
  isInWishlist: boolean;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private itemService: ItemService,
    private authService: AuthGuardService,
    private snackBar: MatSnackBar,
    private accService: AccountService
  ) { }

  ngOnInit(): void {
    this.getItem();
    this.isItemInWishlist();
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
    this.openSnackBar('Item removed from your wishlist!')
    this.isInWishlist = false;
  }

  isItemInWishlist(): void {
    const item_id = +this.route.snapshot.paramMap.get('id');
    this.itemService.checkIfInWishlist(item_id).subscribe(data => this.isInWishlist = data);
  }

}
