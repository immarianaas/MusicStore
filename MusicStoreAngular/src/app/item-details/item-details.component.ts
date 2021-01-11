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
  editVar: boolean;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private itemService: ItemService,
    private authService: AuthGuardService,
    private snackBar: MatSnackBar,
    private accService: AccountService
  ) {
    this.editVar = false;
  }

  ngOnInit(): void {
    this.getItem();
    if (this.authService.isLoggedVar()) {
      this.isItemInWishlist();
    }
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
    this.itemService.updateItem(item).subscribe(() => this.editVar = false);
  }

  cancel(): void {
    this.itemService.getItem(this.item.id).subscribe( item => {
      this.item = item;
      this.editVar = false;
    });
  }

  deleteItem(itemId: number): void {
    this.itemService.deleteItem(itemId).subscribe( () => this.goBack());
  }
}
