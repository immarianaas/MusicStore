import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /* object representing user */
  public user: User;

  constructor(public userService: UserService) {
    console.log(userService.toString());
  }

  ngOnInit(): void {
    this.user = {
      username: '',
      password: '',
    };
  }


  login() {
    this.userService.login({'username' : this.user.username, 'password': this.user.password});
  }

  refreshToken() {
    this.userService.refreshToken();
  }

  logout() {
    this.userService.logout();
  }

}
