import {Manufacturer} from './manufacturer';

export class Instrument {
  name: string;
  category: string;
  manufacturer : Manufacturer;
  description: string;
  nr_serie: number;
  image: string;

  toString(): string {
    return 'INSTRUMENT: name: ' + this.name + 'manufacturer: ' + this.manufacturer;
  }
}
