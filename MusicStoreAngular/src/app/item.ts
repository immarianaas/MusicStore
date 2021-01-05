import {Instrument} from './instrument';

export class Item {
  id: number;
  instrument: Instrument;
  // instrument_object: Instrument;
  price: number;

  constructor(id: number, instrument: Instrument, price: number) {
    this.id = id;
    this.instrument = instrument;
    this.price = price;
  }
}
