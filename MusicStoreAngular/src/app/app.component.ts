import { Component } from '@angular/core';
import {Account} from './account';
import {UserService} from './user.service';

import {Location} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  account: Account;
  isLoggedIn: boolean;
  isAdmin: boolean;

  constructor(
    private userService: UserService,
    private location: Location
  ) {
    this.userService.loggedInInfo.subscribe(val => this.isLoggedIn = val);
    this.userService.adminInfo.subscribe(val => this.isAdmin = val);
  }

  goBack(): void {
    this.location.back();
  }

}
