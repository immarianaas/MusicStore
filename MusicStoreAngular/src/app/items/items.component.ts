import {Component, Input, OnInit} from '@angular/core';
import { Item } from '../item';
import { ItemService } from '../item.service';

import { InstrumentService } from '../instrument.service';
import {Router} from '@angular/router';
import {AuthGuardService} from '../auth-guard.service';
import {Location} from '@angular/common';
import {Manufacturer} from '../manufacturer';
import {AccountService} from '../account.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import {MatFormFieldAppearance} from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import {ThemePalette} from '@angular/material/core';
import {ManufacturerService} from '../manufacturer.service';
// import {Instrument} from '../instrument';
import { MatInput } from '@angular/material/input';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';


//import { MatSliderModule } from '@angular/material/slider';

// import { MatSnackBar } from '@angular/material/snack-bar'

import { SliderModule } from 'primeng/slider';
import { Slider } from 'primeng/slider';

import { InputSwitch } from 'primeng/inputswitch';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  val: number = 9;
  priceRange: number[] = null;

  optionsVisible: boolean;

  /* -- para oas ordens -- */
  selectedOrder: string = 'None / Default';
  orderOptions: string[] = ['None / Default', 'Price', 'Alphabetical'];
  descendingActive: boolean = false;

  /* -- para o filtro pelos manufacturers -- */
  selectedManufacturer: number = -1;
  manufacturers: Manufacturer[];

  /* -- para o filtro pelas categories -- */
  selectedCategory: string = "Show all";
  categories: string[] = ['Show all', 'wind', 'strings', 'percussion'];

  /* -- para o range dos precos -- */
  minPrice: number;
  maxPrice: number;

  /* para pesquisa por palavra */
  searchWord: string;

  // MapPaginator inputs
  length: number;//  = 100;
  pageSize = 6;
  pageSizeOptions: number[] = [6, 12, 18, 24];

  pageEvent: PageEvent;
  activePageDataChunk = [];

  setPageSizeOptions(setPageSizeOptionsInput: string){
    //if (setPageSizeOptionsInput) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    //}
  }

  onPageChanged(e) {
    let firstCut = e.pageIndex * e.pageSize;
    let secondCut = firstCut + e.pageSize;
    this.activePageDataChunk = this.items.slice(firstCut, secondCut);
  }

  allItems: Item[];
  items: Item[];
  // instr: Instrument;
  @Input() manufacturer_id: number;
  isInWishlist: Map<number, boolean> = new Map<number, boolean>();

  constructor(private itemService: ItemService,
              private manuService: ManufacturerService,
              private accService: AccountService,
              private authService: AuthGuardService,
              private location: Location,
              private snackBar: MatSnackBar,
    ) {
    this.priceRange = [null, null];
  }

  ngOnInit(): void {
    if (!this.manufacturer_id)
      this.getItems();
    else
      this.getItemsByManufacturer(this.manufacturer_id);
    if (this.authService.isLoggedVar()) {
      this.fillMapIsInWishlist();
    }
    this.getAllManufacturers();
  }

  goBack(): void {
    this.location.back();
  }

  isAdmin(): boolean {
    return this.authService.isAdminVar();
  }

  getAllManufacturers(): void {
    this.manuService.getManufacturers().subscribe(data => this.manufacturers = data );
  }

  getItems(): void {
    this.itemService.getItems().subscribe(
      items => {
        this.items = items;
        this.allItems = items;
        this.setUpFirstPagePaginator(items);
        /* n sei pq o max n tava a dar bemm...
        this.maxPrice = items.reduce((max, p) => p.price > max ? p.price : max, items[0].price);
        this.minPrice = items.reduce((min, p) => p.price < min ? p.price : min, items[0].price);
        //this.maxPrice = Math.max(this.items.map(d => d.price));
        */
        this.minPrice = 0
        this.maxPrice = 0
        for (let p of items) {
          this.minPrice = this.minPrice < p.price ? this.minPrice : p.price;
          this.maxPrice = this.maxPrice > p.price ? this.maxPrice : p.price;
        }
        console.log('max price: ' + this.maxPrice);
        console.log('min price: ' + this.minPrice);

      }
    );
  }

  setUpFirstPagePaginator(it: Item[]): void {
    this.length = it.length;
    //this.activePageDataChunk = this.items.slice(0, this.pageSize);
    this.activePageDataChunk = it.slice(0, this.pageSize);
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Ok', {duration: 5000, panelClass: ['my-snack-bar']} );
  }

  getItemsByManufacturer(manufacturer_id: number): void {
    // só usado nos manufacturers (se n, tinha-se de tirar a ultima linha do subscribe)
    this.itemService.getItemsByManufacturer(manufacturer_id).subscribe(
      items => {
        this.items = items;
        this.length = items.length;
        this.activePageDataChunk = this.items.slice(0, this.pageSize);
        this.allItems = items;
      });
  }

  purchase(id: number): void {
    if (!this.authService.isLogged()) {
      return ;
    }
    this.itemService.purchaseItem(id).subscribe();
    this.openSnackBar('Item added to shopping cart!');
  }

  addWishlist(id: number): void {
    if (!this.authService.isLogged()) return;
    this.itemService.addToWishList(id).subscribe();
    this.openSnackBar('Item added to wishlist!');
    this.isInWishlist.set(id, true);
  }

  remWishList(id: number): void {
    this.accService.removeItemWishlistItemId(id).subscribe();
    this.openSnackBar('Item removed from your wishlist!');
    this.isInWishlist.set(id, false);
  }

  fillMapIsInWishlist(): void {
    // 1o, get wishlist:
    this.accService.getWishlist().subscribe(
      data => { if (data) {
          for (let w of data.items) {
            this.isInWishlist.set(w.item.id, true);
          }
        }
        console.log('map is set');
        //this.wishlist = data;
      });
  }

    orderItemsByAlpha(asc: boolean): void {
      if (asc)
        this.items = this.items.sort((x, y) => {
          if (x.instrument.name > y.instrument.name) return 1;
          if (x.instrument.name < y.instrument.name) return -1;
          return 0;
        });
      else
        this.items = this.items.sort((y, x) => {
          if (x.instrument.name > y.instrument.name) return 1;
          if (x.instrument.name < y.instrument.name) return -1;
          return 0;
        });
    }

    orderItemsByPrice(asc: boolean): void {
      if (asc) {
        this.items = this.items.sort((x, y) => {
          return x.price-y.price;
        });
      } else {
        this.items = this.items.sort((x, y) => {
          return y.price-x.price;
        });
      }

    }

  applyOrder(): void {
    if (this.selectedOrder == 'None / Default')
      console.log('solve this...??')
    else if (this.selectedOrder == 'Price')
      this.orderItemsByPrice(!this.descendingActive);
    else if (this.selectedOrder == 'Alphabetical')
      this.orderItemsByAlpha(!this.descendingActive);

    this.setUpFirstPagePaginator(this.items);

    console.log('already sorted!!');
    //console.log(JSON.stringify(this.items));

  }

  toggleDescending(): void {
    this.descendingActive = !this.descendingActive;
    this.applyOrder();
  }

  filterByManufacturer(): void {
    if (this.selectedManufacturer == -1)
      console.log('dunno , mas provavelmente n fazer nada')
    else
      this.items = this.items.filter(item => item.instrument.manufacturer.id == this.selectedManufacturer);
  }

  filterByCategory(): void {
    if (this.selectedCategory == 'Show all')
      console.log('duuno what do do here still (acho q nada?)');
    else
      this.items = this.items.filter(item => item.instrument.category == this.selectedCategory);
  }

  applyFilters(): void {
    // 1o, fazer reset a tudo:
    this.items = this.allItems;

    //2o, ver se ha filter nos manufacturers:
    this.filterByManufacturer();

    //3o, ver se ha filter na categoria:
    this.filterByCategory();

    //4o, checkar o price range
    this.applyPriceRange();

    // added: filter by keyword
    this.filterByKeyword();

    //5o (e ultimo, acho eu?) ver a ordem e aplicar:
    this.applyOrder();

    //console.log(JSON.stringify(this.items));

  }

  applyPriceRange(): void {
    this.priceRange = [this.priceRange[0], this.priceRange[1]]; /* sem isto o slider n da :shurg: */
    //this.items = this.items.filter( item => ( !this.minPrice || item.price > this.minPrice ) && ( !this.maxPrice || item.price <= this.maxPrice) );
    this.items = this.items.filter( item => ( !this.priceRange[0] || item.price > this.priceRange[0] ) && ( !this.priceRange[1] || item.price <= this.priceRange[1]) );
  }

  filterByKeyword(): void {
    if (this.searchWord)
      this.items = this.items.filter( item => ( item.instrument.name.toLowerCase().includes(this.searchWord.toLowerCase()) ));
  }

}
