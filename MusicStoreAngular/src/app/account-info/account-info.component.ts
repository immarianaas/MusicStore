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
    this.accountService.getAccountAddresses().subscribe(addrs => this.addrs = addrs,
                              err => console.log('ERROR: ' + err),
                            () => console.log(this.addrs));
  }

  getAccountDetails(): void {
    this.accountService.getAccountInfo().subscribe(user => this.account = user);
  }

  delAccountInfoErrors(): void {
    this.errors['name'] = [];
    this.errors['gender'] = [];
    this.errors['contact'] = [];
  }

  delAddressErrors(): void {
    this.errors['street'] = [];
    this.errors['door'] = [];
    this.errors['country'] = [];
    this.errors['city'] = [];
    this.errors['code'] = [];
  }

  editAccountInfo(): void {
    this.editing.set('account', true);
  }

  saveEditedAccount(): void {
    if (this.is_accountdata_correct()) {
      this.accountService.updateAccount(this.account).subscribe();
      this.editing.set('account', false);
      this.delAccountInfoErrors();
    }
  }

  cancelEditingAccount(): void {
    this.editing.set('account', false);
    this.getAccountDetails();
    this.delAccountInfoErrors();
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
    if (this.is_everything_correct_address(this.addrs[this.canEdit])) {
      this.accountService.createAddress(this.addrs[this.canEdit]).subscribe();
      this.delAddressErrors();
    }
    this.canEdit = -1;
    this.addingAddr = false;
  }

  deleteAddress(index: number): void {
    this.delAddressErrors();
    this.accountService.deleteAddress(this.addrs[index].id).subscribe( () => this.addrs.splice(index, 1),
                                                                err => console.log('ERRO: ' + err));
  }

  cancel(): void {
    this.delAddressErrors();
    this.canEdit = -1;
    this.addrs.splice(-1, 1);
    this.addingAddr = false;
  }

  editAddress(index: number): void {
    this.delAddressErrors();
    this.canEdit = index;
  }

  cancelEditAddress(): void {
    this.canEdit = -1;
    this.getAccountAddresses();
    this.delAddressErrors();
  }

  saveEditAddress(): void {
    if (this.addrs[this.canEdit]) {
      console.log(this.addrs[this.canEdit]);
      if (this.is_everything_correct_address(this.addrs[this.canEdit])) {
        this.accountService.updateAddress(this.addrs[this.canEdit]).subscribe(() => this.canEdit = -1);
        this.delAddressErrors();
      }
    }
  }

  /* --- helper functions --- */
  is_everything_correct_address(new_addr: Address): boolean {
    let is_false = false;

    if (!new_addr.street || new_addr.street.trim().length === 0) {
      this.errors['street'] = ['this field cannot be empty'];
      is_false = true;
    }

    if (!new_addr.code || new_addr.code.trim().length === 0) {
      this.errors['code'] = ['this field cannot be empty'];
      is_false = true;
    }

    if (!new_addr.country || new_addr.country.trim().length === 0) {
      this.errors['country'] = ['this field cannot be empty'];
      is_false = true;
    }

    if (!new_addr.door) {
      this.errors['door'] = ['this field cannot be empty'];
      is_false = true;
      //} else if (!(typeof this.account.contact == "number")){
    } else if (isNaN(new_addr.door)){
      this.errors['door'] = ['this field must contain only digits'];
      is_false = true;
    }

    if (!new_addr.city) {
      this.errors['city'] = ['this field cannot be empty']; //['an option must be chosen'];
      is_false = true;
    }
    return !is_false;
  }


  is_accountdata_correct(): boolean {
    let is_false = false;

    if (!this.account.name || this.account.name.trim().length === 0) {
      this.errors['name'] = ['this field cannot be empty'];
      is_false = true;
    }

    if (!this.account.contact) {
      this.errors['contact'] = ['this field cannot be empty'];
      is_false = true;
      // } else if (!(typeof this.account.contact == "number")){
    } else if (isNaN(this.account.contact)){
      this.errors['contact'] = ['this field must contain only digits'];
      is_false = true;
    }

    if (!this.account.gender) {
      this.errors['gender'] = ['an option must be chosen'];
      is_false = true;
    }
    return !is_false;
  }


}
