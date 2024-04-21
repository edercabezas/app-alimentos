import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {MatCard} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {CrudService} from "../../services/crud/crud.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ReloadComponent} from "../../component/reload/reload.component";
import {MatDialog} from "@angular/material/dialog";
import {CartComponent} from "../../component/cart/cart.component";
import {WatherComponent} from "../../component/wather/wather.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf,
    MatCard,
    CurrencyPipe,
    MatButton,
    MatIcon,
    RouterLink,
    NgIf,
    ReloadComponent,
    WatherComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent implements OnInit{

  products: any[];
  statusProduct: boolean = true;
  constructor(private _crud: CrudService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog) {
    this.products = [];
  }


  ngOnInit(): void {


    this.activatedRoute.params.subscribe((value: any) => {

      if (value && value.id > 0) {
        this.getProductCategory(value.id);
      } else {
        this.getProducts();
      }

    });

  }


  public getProductCategory(code: number): void {
    this.products = [];
    const data = this._crud.readDetailOrder('/products', 'category',  +code);

    data.subscribe(( res: any) => {
      this.products = res;

      this.statusProduct = false;


    });

  }

  getProducts(): void {
    this.products = [];
    this._crud.read('/products').then((response: any) => {

      response.subscribe((res: any) => {
        this.products = res;
        this.statusProduct = false;


        this.products = this.products.filter((item: any) => item.status === true);

      });


    }).catch((error: any) => {
      this.statusProduct = false;
    })
  }


  redirectDetail(item: any): void {

    const url = item.nameProduct.toLowerCase().replaceAll(" ", '-').replaceAll(",", '');

    this.router.navigate([`/detail-product/${item.id}/${url}`]);

  }


  openCart(data: any): void {

    this.dialog.open(CartComponent, {
      width: '700px',
      height: '500px',
      data: data
    });

  }




}
