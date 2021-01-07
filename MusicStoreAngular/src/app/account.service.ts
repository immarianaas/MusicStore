import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Account } from './account';
import {UserService} from './user.service';
import {Address} from './address';

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

  createAccount(acc: Account): any {
    console.log('nao?');
    return this.http.post(this.baseURL + 'create-account', acc, this.getCorrectHeader());
  }

  getAccountAddresses(): Observable<Address[]> {
    let url = this.baseURL + 'addresses';
    return this.http.get<Address[]>(url, this.getCorrectHeader());
  }

  createAddress(addr: Address): any {
    return this.http.post<Address>(this.baseURL+'create-address', addr, this.getCorrectHeader())
  }

  /* -- helper functions -- */
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


}
