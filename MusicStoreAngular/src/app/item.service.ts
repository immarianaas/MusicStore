import { Injectable } from '@angular/core';
import { Item } from './item';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// just for a test. probably to remove later:
import { UserService } from './user.service';


const httpOptions = {
  headers: new HttpHeaders(
    {'Content-Type': 'application/json'}
  )
};

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private baseURL = 'http://localhost:8000/ws/';

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}




  getItems(): Observable<Item[]> {
    const url = this.baseURL + 'items';

    return this.http.get<Item[]>(url, this.getCorrectHeader());
  }

  getItem(id: number): Observable<Item> {
    const url = this.baseURL + 'items/' + id;
    return this.http.get<Item>(url);
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


}
