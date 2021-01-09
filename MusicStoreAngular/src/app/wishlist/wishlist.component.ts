import { Component, OnInit } from '@angular/core';

import { AccountService } from '../account.service';
import {ItemList} from '../itemList';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: ItemList;

  constructor( private accService: AccountService ) { }

  ngOnInit(): void {
    this.getWishlist();
  }

  getWishlist(): void {
    this.accService.getWishlist().subscribe( data => this.wishlist = data);
  }

  removeItem(item_qty_id: number): void {
    this.accService.removeItemWishlist(item_qty_id).subscribe();
    this.getWishlist();
  }

}
