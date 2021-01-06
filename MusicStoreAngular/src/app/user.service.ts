import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';

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
  public tokenExpires: Date;

  // username of logged in user
  public username: string;

  // error messages received from the login attempt
  public errors: any = [];

  constructor(private http: HttpClient) { }

  public login(user: User): void {
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

  public refreshToken(): void {
    this.http.post(this.baseURL + 'token-refresh/', JSON.stringify({token: this.token}), httpOptions).subscribe(
      data => {
        this.updateData(data['token']);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }


  public logout(): void {
    this.token = null;
    this.tokenExpires = null;
    this.username = null;
  }

  private updateData(token): void {
    this.token = token;
    this.errors = [];
    // decode the token to read the username
    // and the expiration timestamp
    const tokenParts = this.token.split('.');
    console.log(tokenParts);

    const tokenDecoded = JSON.parse(window.atob(tokenParts[1]));

    this.tokenExpires = new Date(tokenDecoded.exp * 1000);
    this.username = tokenDecoded.username;
  }

  toString(): string {
    return 'AUTHENTICATION token: ' + this.token + '\nexpires: ' + this.tokenExpires;
  }

}
