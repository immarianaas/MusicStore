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
  private baseURL = 'http://orlandop.pythonanywhere.com/ws/';

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}


  getItems(): Observable<Item[]> {
    const url = this.baseURL + 'items';

    return this.http.get<Item[]>(url, this.getCorrectHeader());
  }

  getItemsByManufacturer(manuId: number): Observable<Item[]> {
    const url = this.baseURL + 'manufacturers/' + manuId + '/items';
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

  addToWishList(itemId: number): any {
    return this.http.post(this.baseURL + 'add-to-wishlist', itemId, this.getCorrectHeader());
  }

  checkIfInWishlist(itemId: number): Observable<boolean> {
    return this.http.get<boolean>(this.baseURL + 'in-wishlist/' + itemId, this.getCorrectHeader());
  }

  deleteItem(itemId: number): Observable<any> {
    const url = this.baseURL + 'deleteitem/' + itemId;
    return this.http.delete(url, this.getCorrectHeader());
  }

  updateItem(item: Item): Observable<any> {
    return this.http.put<Item>(this.baseURL + 'updateitem', item, this.getCorrectHeader());
  }

  createItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.baseURL + 'additem', item, this.getCorrectHeader());
  }

}
