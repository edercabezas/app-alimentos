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
import {Favorite} from "../../interface/favorite";
import {SesionService} from "../../services/sesion-global/sesion.service";
import {AuthComponent} from "../../component/auth/auth.component";
import {AlertService} from "../../services/alert/alert.service";
import {CartService} from "../../services/cart/cart.service";


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
  setFavoriteData!: Favorite;
  userRegister: any;

  constructor(private _crud: CrudService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private storage: SesionService,
              public  dialog: MatDialog,
              private alert: AlertService ) {
    this.products = [];
  }


  ngOnInit(): void {

    this.llamarUsuarioData();
    this.activatedRoute.params.subscribe((value: any) => {

      if (value && value.id > 0) {
        this.getProductCategory(value.id);
      } else {
        this.getProducts();
      }

    });

    this._setFavorites();

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

  llamarUsuarioData() {
    this.storage.currentMessage.subscribe(response => {
      this.userRegister  = response;

    });
  }


public setFavorite(data: any): void {

    if(!this.userRegister) {
      this.openModalLogin(1);
      return;
    }

    this.setFavoriteData.id_favorite = this._crud.generateId();
    this.setFavoriteData.user_id = this.userRegister.id;
    this.setFavoriteData.id = data.id;
    this.setFavoriteData.nameProduct = data.nameProduct;
    this.setFavoriteData.code = data.code;
    this.setFavoriteData.img = data.img;
    this.setFavoriteData.category = data.category;
    this.setFavoriteData.price = data.price;
    this.setFavoriteData.prefijo = data.prefijo;
    this.setFavoriteData.status = data.status;
    this.setFavoriteData.size = data.size;
    this.setFavoriteData.description = data.description;
    this.setFavoriteData.value_prefijo = data.value_prefijo;


  this._crud.setProduct('/favorite', this.setFavoriteData).then((response: any) => {

    if (response) {
      this.alert.showToasterFull('El producto se agrego a tus favoritos');

    }
  })
}

private _setFavorites(): void {
    this.setFavoriteData = {
      id: '',
      nameProduct: '',
      code: '',
      img: '',
      category: 0,
      id_favorite: '',
      price: 0,
      prefijo: '',
      status: true,
      size: 0,
      user_id: 0,
      description: '',
      value_prefijo: '',
    }
}


  public openModalLogin(value: number): void {

    this.dialog.open(AuthComponent, {
      width: '500px',
      height: '410px',
      data: {
        item: value
      }
    });
  }



}
