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
  addingAddr: boolean;
  errors: any[] = [];
  COUNTRIES: any = COUNTRIES;
  editing: Map<string, boolean>;

  canEdit: number;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService,
    private accountService: AccountService
  ) {
    this.addingAddr = false;
    this.editing = new Map<string, boolean>();

    this.canEdit = -1;
  }

  ngOnInit(): void {
    this.getAccountInfo();
  }

  getAccountInfo(): void {
    this.getAccountDetails();
    this.getAccountAddresses();
  }

  getAccountAddresses(): void {
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
    this.addrs.push(new Address());
    this.canEdit = this.addrs.length - 1;
    this.addingAddr = true;
  }

  saveNewAddress(): void {
    this.errors = [];
    if (this.is_everything_correct_address()) {
      console.log('guardando....... ...');
      this.accountService.createAddress(this.addrs[this.canEdit]).subscribe(
        data => {
          // this.addrs.push(data);
          this.addingAddr = false;
        },
        err => {
          this.errors = err.error;
          //this.errors['others'] = [JSON.stringify(err)];
        }
      );

    }
    this.canEdit = -1;
    this.addingAddr = false;
  }

  cancel(): void {
    this.canEdit = -1;
    this.addrs.splice(-1, 1);
    this.addingAddr = false;
  }

  editAddress(index: number): void {
    this.canEdit = index;
  }

  cancelEditAddress(): void {
    this.canEdit = -1;
    this.getAccountAddresses();
  }

  saveEditAddress(): void {
    console.log('Por fazer');
    // TODO
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
