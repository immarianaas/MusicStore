import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import { User } from '../user';
import { Account } from '../account';
import { AccountService } from '../account.service';
import {isBoolean} from 'util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /* object representing user */
  public user: User;
  private creating_account: boolean;
  public account: Account;
  public errors: any = [];


  constructor(public userService: UserService, private accService: AccountService) {
    this.creating_account = false;
    console.log(userService.toString());
  }

  ngOnInit(): void {
    this.user = {
      username: '',
      password: ''
    };
  }


  login(): void {
    this.userService.login({username : this.user.username, password: this.user.password});
  }

  refreshToken(): void {
    this.userService.refreshToken();
  }

  logout(): void {
    this.userService.logout();
  }

  create_account(): void {
    this.errors = []
    this.creating_account = true;
    this.user = {
      username: '',
      password: ''
    };
    this.account = {
      user: this.user,
      id: 0,
      name: '',
      gender: '',
      contact: null,
      role: 'C' // C for customer
    };
  }

  save_new_account(): void {
    this.errors = []

    if (this.is_everything_filled_in()) {
      // this.error = 'All fields must be filled!';
      this.accService.createAccount(this.account).subscribe(
        res => {
          console.log('account -> ' + res ) ;
          this.account = res;
          this.creating_account = false;
        },
        err => {
          console.log('errors -> ' + JSON.stringify(err.error) );
          if (err.error === 'UNIQUE constraint failed: auth_user.username')
            this.errors['username'] = ['this username is already taken']
          else if ( err.error === 'The given username must be set')
            this.errors['username'] = ['this field cannot be empty']
          else
            this.errors = err.error;
        }
      );
    }
  }

  cancel(): void {
    this.creating_account = false;
    this.user = {
      username: '',
      password: ''
    };
  }

  is_everything_filled_in(): boolean {
    let is_false: boolean = false

    if (!this.user.username || this.user.username.trim().length == 0) {
      this.errors['username'] = ['this field cannot be empty']
      is_false = true
    }

    if (!this.user.password || this.user.password.trim().length == 0) {
      this.errors['password'] = ['this field cannot be empty'];
      is_false = true
    } else if (this.user.password.trim().length <= 6) {
      this.errors['password'] = ['password has to be more than 6 characters long'];
      is_false = true
    }

    if (!this.account.name || this.account.name.trim().length == 0) {
      this.errors['name'] = ['this field cannot be empty'];
      is_false = true
    }

    if (!this.account.contact) {
      this.errors['contact'] = ['this field cannot be empty'];
      is_false = true
      //} else if (!(typeof this.account.contact == "number")){
      } else if (isNaN(this.account.contact)){
      this.errors['contact'] = ['this field must contain only digits'];
      is_false = true
    }

    if (!this.account.gender) {
      this.errors['gender'] = ['an option must be chosen'];
      is_false = true
    }
    return !is_false;
  }


}
