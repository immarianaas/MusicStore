import { Component, OnInit } from '@angular/core';
import {Order} from '../order';
import {AccountService} from '../account.service';
import {AuthGuardService} from '../auth-guard.service';

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
    private authService: AuthGuardService
  ) { this.noOrders = false; }

  ngOnInit(): void {
    if (this.isAdmin()) {
      this.getOrdersAdmin();
    } else {
      this.getOrders();
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdminVar();
  }

  checkNoOrders(responseStatus: number): void {
    if (responseStatus === 404) {
      this.noOrders = true;
    } else {
      this.noOrders = false;
    }
  }

  getOrders(): void {
    this.accountService.getOrders().subscribe(orders => this.orders = orders,
                                          response => this.checkNoOrders(response.status));
  }

  getOrdersAdmin(): void {
    this.accountService.getAllOrdersAdmin().subscribe(orders => this.orders = orders,
      response => this.checkNoOrders(response.status));
  }

}
