

export class Manufacturer {
  id: number;
  name: string;
  country: string;
  logo: string;

  constructor(id: number, name: string, country: string, logo: string) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.logo = logo;
  }
}
