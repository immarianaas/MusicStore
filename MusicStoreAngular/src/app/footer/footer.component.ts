import { Component, OnInit } from '@angular/core';

import {ButtonModule} from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  modalVisible: boolean = false;
  sender: string;
  subject: string;
  message: string;

  contactForm: FormGroup;
  /*
  contactForm = new FormGroup({
    sender: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    subject: new FormControl('', [
      Validators.required
    ]),
    message: new FormControl('', [
      Validators.required
    ])
  })
   */

  resetData(): void {
    this.sender= null;
    this.subject= null;
    this.message= null;

    this.contactForm = new FormGroup({
      sender: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      subject: new FormControl('', [
        Validators.required
      ]),
      message: new FormControl('', [
        Validators.required
      ])
    })
  }


  constructor() { this.resetData(); }

  ngOnInit(): void {
  }

  get senderVer() { return this.contactForm.get('sender'); }
  get subjectVer() { return this.contactForm.get('subject'); }
  get msgVer() { return this.contactForm.get('message'); }

  send(): void {
    console.log(' --> message sent? (qdo isto tiver implementado sim i hope)');
    this.modalVisible = false;
    this.resetData();

  }

  openModal(): void {
    this.modalVisible = true;
  }

}
