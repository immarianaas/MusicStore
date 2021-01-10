import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { User } from '../user';
import { UserService } from '../user.service';
import { AccountService } from '../account.service';
import { Account } from '../account';
import { Address } from '../address';

import { COUNTRIES } from '../COUNTRIES';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {

  account: Account;
  addrs: Address[] = [];
  adding_addr: boolean;
  new_addr: Address;
  errors: any[] = [];
  COUNTRIES: any = COUNTRIES;
  editing: Map<string, boolean>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService,
    private accountService: AccountService
  ) {
    this.adding_addr = false;
    this.editing = new Map<string, boolean>();
  }

  ngOnInit(): void {
    this.getAccountInfo();
  }

  getAccountInfo(): void {
    this.getAccountDetails();
    this.accountService.getAccountAddresses().subscribe(addrs => this.addrs = addrs);
  }

  getAccountDetails(): void {
    this.accountService.getAccountInfo().subscribe(user => this.account = user);
  }

  editAccountInfo(): void {
    this.editing.set('account', true);
  }

  saveEditedAccount(): void {

  }

  cancelEditingAccount(): void {
    this.editing.set('account', false);
    this.getAccountDetails();
  }


  isEditing(field: string): boolean {
    return (this.editing.has(field) && this.editing.get(field));
  }

  addAddress(): void {
    this.adding_addr = true;
    this.new_addr = new Address();
  }

  saveNewAddress(): void {
    this.errors = [];
    if (this.is_everything_correct_address()) {
      console.log('guardando....... ...');
      this.accountService.createAddress(this.new_addr).subscribe(
        data => {
          this.addrs.push(data);
          this.adding_addr = false;
        },
        err => {
          this.errors = err.error;
          //this.errors['others'] = [JSON.stringify(err)];
        }
      );

    }
  }

  cancel(): void {
    this.adding_addr = false;
  }


  /* --- helper functions --- */
  is_everything_correct_address(): boolean {
    let is_false = false;

    if (!this.new_addr.street || this.new_addr.street.trim().length == 0) {
      this.errors['street'] = ['this field cannot be empty']
      is_false = true;
    }

    if (!this.new_addr.code || this.new_addr.code.trim().length == 0) {
      this.errors['code'] = ['this field cannot be empty'];
      is_false = true;
    }

    if (!this.new_addr.country || this.new_addr.country.trim().length == 0) {
      this.errors['country'] = ['this field cannot be empty'];
      is_false = true;
    }

    if (!this.new_addr.door) {
      this.errors['door'] = ['this field cannot be empty'];
      is_false = true
      //} else if (!(typeof this.account.contact == "number")){
    } else if (isNaN(this.new_addr.door)){
      this.errors['door'] = ['this field must contain only digits'];
      is_false = true;
    }

    if (!this.new_addr.city) {
      this.errors['city'] = ['this field cannot be empty']; //['an option must be chosen'];
      is_false = true;
    }
    return !is_false;
  }


}
