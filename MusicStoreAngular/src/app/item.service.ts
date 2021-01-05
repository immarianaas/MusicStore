import { Injectable } from '@angular/core';
import { Item } from './item';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// just for a test. probably to remove later:
import { UserService } from './user.service';




@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private baseURL = 'http://localhost:8000/ws/';


  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  private httpOptions = {
    headers: new HttpHeaders(
      {'Content-Type': 'application/json'}
        //'Authorization': 'JWT ' + this.userService.token}
      // 'Authorization':  this.userService.token }
    )
  };

  getItems(): Observable<Item[]> {
    const url = this.baseURL + 'items';
    console.log('ITEM SERVICE:\n'+this.userService.toString());
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'Authorization' : 'JWT ' + this.userService.token
      })
    }
    console.log(httpOptions.headers.get('Authorization'));
    console.log(httpOptions.headers.get('Authorization').length);

    return this.http.get<Item[]>(url, httpOptions);

  }

  getItem(id: number): Observable<Item> {
    const url = this.baseURL + 'items/' + id;
    return this.http.get<Item>(url);
  }

}
