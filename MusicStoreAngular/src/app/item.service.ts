import { Injectable } from '@angular/core';
import { Item } from './item';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private baseURL = 'http://localhost:8000/ws/';

  constructor(private http: HttpClient) { }

  getItems(): Observable<Item[]> {
    const url = this.baseURL + 'items';
    return this.http.get<Item[]>(url);
  }

  getItem(id: number): Observable<Item> {
    const url = this.baseURL + 'items/' + id;
    return this.http.get<Item>(url);
  }

}
