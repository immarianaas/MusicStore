import {Item} from './item';


export class ItemQuantity{
  id: number;
  item: Item;
  quantity: number;

  constructor(id: number, item: Item, quantity: number) {
    this.id = id;
    this.item = item;
    this.quantity = quantity;
  }
}
