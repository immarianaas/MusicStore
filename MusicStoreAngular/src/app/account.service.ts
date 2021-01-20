import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Account } from './account';
import {UserService} from './user.service';
import {ItemList} from './itemList';
import {Address} from './address';
import {Item} from './item';
import {ItemQuantity} from './ItemQuantity';
import {OrderModel} from './order-model';
import {Order} from './order';
import {GrowthChart} from './growthChart';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseURL = 'http://localhost:8000/ws/';

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {  }

  getAccountInfo(): Observable<Account> {
    return this.http.get<Account>(this.baseURL + 'account', this.getCorrectHeader());
  }

  createAccount(acc: Account): Observable<any> {
    return this.http.post(this.baseURL + 'create-account', acc, this.getCorrectHeader());
  }

  updateAccount(acc: Account): Observable<any> {
    return this.http.put(this.baseURL + 'updateaccount', acc, this.getCorrectHeader());
  }

  getAccountAddresses(): Observable<Address[]> {
    const url = this.baseURL + 'addresses';
    return this.http.get<Address[]>(url, this.getCorrectHeader());
  }

  createAddress(addr: Address): Observable<any> {
    return this.http.post<Address>(this.baseURL + 'create-address', addr, this.getCorrectHeader());
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.delete(this.baseURL + 'deleteaddress/' + id, this.getCorrectHeader());
  }

  updateAddress(addr: Address): Observable<any> {
    return this.http.put(this.baseURL + 'updateaddress', addr, this.getCorrectHeader());
  }

  /* -- helper functions -- */
  getCorrectHeader(): { headers: HttpHeaders} {
    if (this.userService.token) {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'JWT ' + this.userService.token
        })
      };

    } // else:
    return { headers: new HttpHeaders(
        {'Content-Type': 'application/json'}
      )};
  }

  getShoppingCart(): Observable<ItemList> {
    return this.http.get<ItemList>( this.baseURL + 'shoppingcart', this.getCorrectHeader());
  }

  incItemAtCart(idItemqt: number): Observable<any> {
    return this.http.put(this.baseURL + 'shoppingcart/inc', idItemqt, this.getCorrectHeader());
  }

  decItemAtCart(idItemqt: number): Observable<any> {
    return this.http.put(this.baseURL + 'shoppingcart/dec', idItemqt, this.getCorrectHeader());
  }

  getWishlist(): Observable<ItemList> {
    return this.http.get<ItemList>(this.baseURL + 'wishlist', this.getCorrectHeader());
  }


  removeItemWishlist(itemQtyId: number): Observable<any> {
    const url = this.baseURL + 'wishlist/rem';
    return this.http.put(url,  itemQtyId, this.getCorrectHeader());
  }

  removeItemWishlistItemId(itemId: number): any {
    const url = this.baseURL + 'wishlist/rem?item_id=true';
    return this.http.put(url, itemId, this.getCorrectHeader());
  }

  removeItemAtCart(idItemqt: number): Observable<any> {
    return this.http.put(this.baseURL + 'shoppingcart/rem', idItemqt, this.getCorrectHeader());
  }

  placeOrder(orderModel: OrderModel): Observable<any> {
    return this.http.post<OrderModel>(this.baseURL + 'placeorder', orderModel, this.getCorrectHeader());
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseURL + 'orders', this.getCorrectHeader());
  }

  getAllOrdersAdmin(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseURL + 'ordersadmin', this.getCorrectHeader());
  }

  getUserAppGrowth(): Observable<GrowthChart[]> {
    return this.http.get<GrowthChart[]>(this.baseURL + 'userappgrowth', this.getCorrectHeader());
  }

  getCapitalChart(): Observable<GrowthChart[]> {
    return this.http.get<GrowthChart[]>(this.baseURL + 'capitalgrowth', this.getCorrectHeader());
  }
}
