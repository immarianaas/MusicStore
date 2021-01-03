import { Injectable } from '@angular/core';

import { Manufacturer } from './manufacturer';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {
  private baseURL = 'http://localhost:8000/ws/';
  constructor(private http: HttpClient) { }

  getManufacturers(): Observable<Manufacturer[]> {
    return this.http.get<Manufacturer[]>(this.baseURL + 'manufacturers');
  }
}
