import {EventEmitter, Injectable, Output} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';
import {AccountService} from './account.service';
import {Account} from './account';
import {ActivatedRoute, Router} from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL = 'http://localhost:8000/ws/';

  isLoggedIn: boolean;
  @Output() loggedInInfo = new EventEmitter<boolean>();
  @Output() adminInfo = new EventEmitter<boolean>();

  // JWT token
  public token: string;

  // token expiration date
  public tokenExpires: Date;

  // username of logged in user
  public username: string;

  // error messages received from the login attempt
  public errors: any = [];

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router) {
    this.isLoggedIn = false;
  }

  private getUserAccount(): void {
    const httpOptWithJWT = {
      headers : new HttpHeaders(
        {'Content-Type' : 'application/json',
                  Authorization: 'JWT ' + this.token}
      )
    };
    this.http.get<Account>(this.baseURL + 'account', httpOptWithJWT).subscribe(
      account => { if (account.role === 'A') {
                          this.adminInfo.emit(true);
                        } else {
                          this.adminInfo.emit(false);
                        }
                   this.loggedInInfo.emit(true);
                   this.isLoggedIn = true;
      }
    );
  }

  public login(user: User): void {
    this.http.post(this.baseURL + 'token-auth/', JSON.stringify(user), httpOptions).subscribe(
      data => {
        this.updateData(data['token']);
        this.getUserAccount();
        this.router.navigate(['/']);
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
        console.log('DATA: '+data);
      },
      err => {
        this.errors = err['error'];
        console.log('ERRORS: ' + JSON.stringify(this.errors));
      }
    );
  }



  public logout(): void {
    this.token = null;
    this.tokenExpires = null;
    this.username = null;
    this.adminInfo.emit(false);
    this.loggedInInfo.emit(false);
    this.isLoggedIn = false;
  }

  private updateData(token): void {
    this.token = token;
    this.errors = [];
    // decode the token to read the username
    // and the expiration timestamp
    const tokenParts = this.token.split('.');

    const tokenDecoded = JSON.parse(window.atob(tokenParts[1]));

    this.tokenExpires = new Date(tokenDecoded.exp * 1000);
    this.username = tokenDecoded.username;
  }

  existsButExpired(): boolean {
    if (!this.tokenExpires) return false;
    const now = new Date();
    return now.getTime() > this.tokenExpires.getTime();
  }

  toString(): string {
    return 'AUTHENTICATION token: ' + this.token + '\nexpires: ' + this.tokenExpires;
  }

}
