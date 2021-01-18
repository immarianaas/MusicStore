import { Injectable } from '@angular/core';
import { Instrument } from './instrument';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Item} from './item';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})

export class InstrumentService {
  private baseURL = 'https://orlandop.pythonanywhere.com/ws/';

  constructor(private http: HttpClient) { }

  getInstrument(id: number): Observable<Instrument> {
    const url = this.baseURL + 'instrument/' + id;
    return this.http.get<Instrument>(url);
  }

}
