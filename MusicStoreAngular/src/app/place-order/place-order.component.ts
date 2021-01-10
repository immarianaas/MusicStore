import { Component, OnInit } from '@angular/core';
import {ItemList} from '../itemList';
import {Address} from '../address';
import {AccountService} from '../account.service';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {
  itemList: ItemList;
  addresses: Address[];

  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.getItems();
    this.getAddresses();
  }

  getItems(): void {
    this.accountService.getShoppingCart().subscribe(
      itemList => { this.itemList = itemList; }
    );
  }

  getAddresses(): void {
    this.accountService.getAccountAddresses().subscribe(
      addresses => this.addresses = addresses
    );
  }

}
