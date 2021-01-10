import { Component, OnInit } from '@angular/core';
import {ItemList} from '../itemList';
import {Address} from '../address';
import {AccountService} from '../account.service';
import {OrderModel} from '../order-model';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {
  itemList: ItemList;
  addresses: Address[];
  orderModel: OrderModel;
  total: string;
  errors: Map<string, string>;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.orderModel = new OrderModel();
    this.errors = new Map();
  }

  ngOnInit(): void {
    this.getItems();
    this.getAddresses();
  }

  getItems(): void {
    this.accountService.getShoppingCart().subscribe(
      itemList => { this.itemList = itemList; this.total = this.getTotal(this.itemList);}
    );
  }

  getAddresses(): void {
    this.accountService.getAccountAddresses().subscribe(
      addresses => this.addresses = addresses
    );
  }

  placeOrder(): void {
    if (this.checkSubmit()) {
      this.accountService.placeOrder(this.orderModel).subscribe(() => {
                                      this.snackBar.open('Thank you for buying in our store ;) You can check your order in your profile page.', 'Ok', {duration: 15000, panelClass: ['my-snack-bar']} );
                                      this.router.navigate(['/']); });
    }
  }

  checkSubmit(): boolean {
    this.errors.clear();
    if (this.orderModel.address === -1) {
      this.errors.set('address', 'Please select one address');
      return false;
    }
    if (this.orderModel.payment === '') {
      this.errors.set('payment', 'Please select one type of payment');
      return false;
    }
    return true;
  }

  getTotal(itemList: ItemList): string {
    let total = 0;
    for (const itemqt of itemList.items) {
      total += itemqt.quantity * itemqt.item.price;
    }
    return total.toFixed(2);
  }
}
