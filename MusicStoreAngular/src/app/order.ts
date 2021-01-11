import {Address} from './address';
import {Account} from './account';
import {ItemList} from './itemList';

export class Order {
  id: number;
  person: Account;
  delivery_address: Address;
  payment_time: string;
  order_status: string;
  list: ItemList;
  payment_method: string;
}
