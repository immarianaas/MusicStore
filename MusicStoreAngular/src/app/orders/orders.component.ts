import { Component, OnInit } from '@angular/core';
import {Order} from '../order';
import {AccountService} from '../account.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[];
  noOrders: boolean;

  constructor(
    private accountService: AccountService,

  ) { this.noOrders = false; }

  ngOnInit(): void {
    this.getOrders();
  }

  checkNoOrders(responseStatus: number): void {
    if (responseStatus === 404) {
      this.noOrders = true;
    } else {
      this.noOrders = false;
    }
  }

  getOrders(): void {
    this.accountService.getOrders().subscribe(orders => {this.orders = orders; console.log(orders); },  // TODO APAGAR
                                          response => this.checkNoOrders(response.status));
  }

}
