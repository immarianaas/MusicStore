import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Account } from './account';
import {UserService} from './user.service';
import {ItemList} from './itemList';

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

  getCorrectHeader(): { headers: HttpHeaders} {
    if (this.userService.token) {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'JWT ' + this.userService.token
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


}
