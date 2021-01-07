import {ItemQuantity} from './ItemQuantity';
import {Account} from './account';


export class ItemList {
  id: number;
  type: string;
  items: ItemQuantity[];
  // person: Account;
  person: number;  // TODO trocar caso faca mais sentido receber tmb as infos do user

  constructor(id: number, type: string, items: ItemQuantity[], person: number) {
    this.id = id;
    this.type = type;
    this.items = items;
    this.person = person;
  }
}
