import {Instrument} from './instrument';

export class Item {
  id: number;
  instrument: Instrument;
  price: number;

  constructor(id: number, price: number) {
    this.id = id;
    this.price = price;
  }
}
