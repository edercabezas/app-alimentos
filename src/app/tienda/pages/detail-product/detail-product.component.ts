import {Component, OnInit} from '@angular/core';
import {CrudService} from "../../services/crud/crud.service";
import {AlertService} from "../../services/alert/alert.service";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {ActivatedRoute, Router} from "@angular/router";
import {Products} from "../../interface/products";
import { NgxImageZoomModule } from 'ngx-image-zoom';
import {CurrencyPipe, NgIf} from "@angular/common";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ReloadComponent} from "../../component/reload/reload.component";
import {CartComponent} from "../../component/cart/cart.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthComponent} from "../../component/auth/auth.component";
import {Favorite} from "../../interface/favorite";
import {SesionService} from "../../services/sesion-global/sesion.service";

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [
    NgxImageZoomModule,
    CurrencyPipe,
    MatButton,
    MatIcon,
    ReloadComponent,
    NgIf,
    MatFabButton
  ],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.scss'
})
export default class DetailProductComponent implements OnInit{

  setProduct!: Products;
  routerIMG: string = '';
  routerFinish: any;
  idUrlProduct: any;
  codeProduct: any;
  reload: boolean = true;

  setFavoriteData!: Favorite;
  userRegister: any;
  constructor( private crud: CrudService,
               private alert: AlertService,
               private imgFir: AngularFireStorage,
               private activatedRoute: ActivatedRoute,
               private router: Router,
               private storage: SesionService,
               public dialog: MatDialog) {
  }
  ngOnInit(): void {

    this.activatedRoute.params.subscribe((value: any) => {
      if (value.id) {
        this.idUrlProduct = value.id;
        this._getProduct(value.id);
      }

    });

    this._setFavorites();
    this.llamarUsuarioData();
  }


  async _getProduct(id: any): Promise<any>  {

    this.reload = true
    this.crud.readGeneral('/products', 'id', id).then( ( response: any) => {
      response.subscribe(( res: any) => {
        const dataProduct = res[0]?.payload?.doc.data();
        this.setProduct = dataProduct as Products;

      });

    }).catch((error: any) => {
    }).finally(() => this.reload = false);
  }


  public backButton(): void {
    this.router.navigate(['/']);
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

    this.setFavoriteData.id_favorite = this.crud.generateId();
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

    this.crud.setProduct('/favorite', this.setFavoriteData).then((response: any) => {

      if (response) {
        this.alert.showToasterFull('El producto se agrego a tus favoritos');

      }

    });

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
