import {Manufacturer} from './manufacturer';

export class Instrument {
  id: number;
  name: string;
  category: string;
  manufacturer: Manufacturer;
  description: string;
  nrSerie: number;
  image: string;

  constructor(id: number, name: string, category: string, manufacturer: Manufacturer, description: string, nrSerie: number, image: string) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.manufacturer = manufacturer;
    this.description = description;
    this.nrSerie = nrSerie;
    this.image = image;
  }

  toString(): string {
    return 'INSTRUMENT: name: ' + this.name + 'manufacturer: ' + this.manufacturer;
  }
}
