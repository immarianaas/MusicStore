import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL = 'http://localhost:8000/ws/';

  // JWT token
  public token: string;

  // token expiration date
  public token_expires: Date;

  // username of logged in user
  public username: string;

  // error messages received from the login attempt
  public errors: any = [];

  constructor(private http: HttpClient) { }

  public login(user) {
    this.http.post(this.baseURL + 'token-auth/', JSON.stringify(user), httpOptions).subscribe(
      data => {
        this.updateData(data['token']);
      },
      err => {
        this.errors = err['error'];
      }
    );
    console.log('login ended' + this.toString());
  }

  public refreshToken() {
    this.http.post(this.baseURL + 'token-refresh/', JSON.stringify({token: this.token}), httpOptions).subscribe(
      data => {
        this.updateData(data['token']);
      },
      err => {
        this.errors = err['error'];
      }
    )
  }


  public logout() {
    this.token = null;
    this.token_expires = null;
    this.username = null;
  }

  private updateData(token) {
    this.token = token;
    this.errors = [];
    // decode the token to read the username
    // and the expiration timestamp
    const token_parts = this.token.split('.');
    console.log(token_parts);

    const token_decoded = JSON.parse(window.atob(token_parts[1]));

    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
  }

  toString(): string {
    return "AUTHENTICATION token: " + this.token + "\nexpires: " + this.token_expires;
  }

}
