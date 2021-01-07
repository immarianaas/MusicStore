import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { User } from '../user';
import { UserService } from '../user.service';
import { AccountService } from '../account.service';
import { Account } from '../account';
import {Address} from '../address';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {

  account: Account;
  addrs: Address[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.getAccountInfo();
  }

  getAccountInfo(): void {
    this.accountService.getAccountInfo().subscribe(user => this.account = user);
    this.accountService.getAccountAddresses().subscribe(addrs => this.addrs = addrs);
  }

}
