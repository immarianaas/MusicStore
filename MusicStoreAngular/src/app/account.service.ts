import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Account } from './account';
import {UserService} from './user.service';
import {ItemList} from './itemList';
import {Address} from './address';
import {Item} from './item';
import {ItemQuantity} from './ItemQuantity';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseURL = 'http://localhost:8000/ws/';

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  getAccountInfo(): Observable<Account> {
    return this.http.get<Account>(this.baseURL + 'account', this.getCorrectHeader());
  }

  createAccount(acc: Account): Observable<any> {
    console.log('nao?');
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

  removeItemWishlist(item_qty_id: number): Observable<any> {
    // nota: n faço mm ideia qual dos metodos é aqui...
    const url = this.baseURL + 'wishlist/rem';
    return this.http.put(url,  item_qty_id, this.getCorrectHeader());
  }

  removeItemAtCart(idItemqt: number): Observable<any> {
    return this.http.put(this.baseURL + 'shoppingcart/rem', idItemqt, this.getCorrectHeader());
  }
}
