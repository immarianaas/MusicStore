import { Injectable } from '@angular/core';

import { Manufacturer } from './manufacturer';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Item} from './item';
import {UserService} from './user.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {
  private baseURL = 'http://localhost:8000/ws/';
  constructor(private http: HttpClient, private userService: UserService) { }

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

  getManufacturers(): Observable<Manufacturer[]> {
    return this.http.get<Manufacturer[]>(this.baseURL + 'manufacturers');
  }

  getManufacturer(id: number): Observable<Manufacturer> {
    return this.http.get<Manufacturer>(this.baseURL + 'manufacturers/' + id);
  }

  getItemsOfManufacturer(id: number): Observable<Item[]> {
    return this.http.get<Item[]>(this.baseURL + 'manufacturers/' + id + '/items');
  }

  deleteManufacturer(id: number): Observable<any> {
    const url = this.baseURL + 'deletemanufacturer/' + id;
    return this.http.delete(url, this.getCorrectHeader());
  }

  updateManufacturer(manu: Manufacturer): Observable<Manufacturer> {
    const url = this.baseURL + 'editmanufacturer';
    return this.http.put<Manufacturer>(url, manu, this.getCorrectHeader());
  }

  createManufacturer(manu: Manufacturer): Observable<Manufacturer> {
    const url = this.baseURL + 'createmanufacturer';
    return this.http.post<Manufacturer>(url, manu, this.getCorrectHeader());
  }
}
