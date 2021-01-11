import { Injectable } from '@angular/core';
import { Item } from './item';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// just for a test. probably to remove later:
import { UserService } from './user.service';
import {ItemQuantity} from './ItemQuantity';


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

  getItemsByManufacturer(manu_id: number): Observable<Item[]> {
    const url = this.baseURL + 'manufacturers/' + manu_id + '/items';
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
          Authorization: 'JWT ' + this.userService.token
        })
      };

    } // else:
    return { headers: new HttpHeaders(
      {'Content-Type': 'application/json'}
    )};
  }

  purchaseItem(id: number): Observable<any> {
    const url = this.baseURL + 'purchase';
    return this.http.post(url, id, this.getCorrectHeader());
  }

  addToWishList(item_id: number): any {
    return this.http.post(this.baseURL+'add-to-wishlist', item_id, this.getCorrectHeader());
  }

  checkIfInWishlist(item_id: number): Observable<boolean> {
    return this.http.get<boolean>(this.baseURL+'in-wishlist/'+item_id, this.getCorrectHeader());
  }

  deleteItem(itemId: number): Observable<any> {
    const url = this.baseURL + 'deleteitem/' + itemId;
    return this.http.delete(url, this.getCorrectHeader());
  }

  updateItem(item: Item): Observable<any> {
    return this.http.put<Item>(this.baseURL + 'updateitem', item, this.getCorrectHeader());
  }

}
