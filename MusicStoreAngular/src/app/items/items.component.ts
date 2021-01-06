import {Component, Input, OnInit} from '@angular/core';
import { Item } from '../item';
import { ItemService } from '../item.service';

import { Instrument } from '../instrument';
import { InstrumentService } from '../instrument.service';
import {Manufacturer} from '../manufacturer';


@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  items: Item[];
  //instr: Instrument;
  @Input() manufacturer_id: number;

  constructor(private itemService: ItemService, private instrService: InstrumentService) { }

  ngOnInit(): void {
    if (!this.manufacturer_id)
      this.getItems();
    else
      this.getItemsByManufacturer();
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

}
