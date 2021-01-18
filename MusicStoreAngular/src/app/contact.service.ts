import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private userService: UserService,
    private http: HttpClient
  ) { }

  private baseUrl = 'https://orlandop.pythonanywhere.com/ws/';

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

  sendMessage(content: any): any {
    const url = this.baseUrl + 'contact_us';
    return this.http.post(url, content, this.getCorrectHeader());
  }

}
