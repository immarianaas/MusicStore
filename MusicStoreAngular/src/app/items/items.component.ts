import {Component, Input, OnInit} from '@angular/core';
import { Item } from '../item';
import { ItemService } from '../item.service';

import { InstrumentService } from '../instrument.service';
import {Router} from '@angular/router';
import {AuthGuardService} from '../auth-guard.service';
import {Location} from '@angular/common';
import {Manufacturer} from '../manufacturer';


@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  items: Item[];
  // instr: Instrument;
  @Input() manufacturer_id: number;

  constructor(private itemService: ItemService, private instrService: InstrumentService,
              private authService: AuthGuardService, private location: Location) { }

  ngOnInit(): void {
    if (!this.manufacturer_id)
      this.getItems();
    else
      this.getItemsByManufacturer();
  }

  goBack(): void {
    this.location.back();
  }

  getItems(): void {
    this.itemService.getItems().subscribe(
      items => {
        this.items = items;
      }
    );
  }

  getItemsByManufacturer(): void {
    this.itemService.getItemsByManufacturer(this.manufacturer_id).subscribe(items => this.items = items);
  }

  purchase(id: number): void {
    if (!this.authService.isLogged()) {
      return ;
    }
    this.itemService.purchaseItem(id).subscribe();
  }

  addWishlist(id: number): void {
    console.log(id);
  }

}
