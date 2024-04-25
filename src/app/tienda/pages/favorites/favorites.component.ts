import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {Router, RouterLink} from "@angular/router";
import {CartComponent} from "../../component/cart/cart.component";
import {SesionService} from "../../services/sesion-global/sesion.service";
import {MatDialog} from "@angular/material/dialog";
import {AlertService} from "../../services/alert/alert.service";
import {DataPayUsers} from "../../interface/data-pay";
import {CrudService} from "../../services/crud/crud.service";
import {Favorite} from "../../interface/favorite";

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatButton,
    MatCard,
    MatIcon,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export default class FavoritesComponent implements OnInit{
  products: any;
  userRegister: any;
  colectionID: any;
  constructor( private router: Router,
               private storage: SesionService,
               public dialog: MatDialog,
               private alert: AlertService,
               private _crud: CrudService) {
    this.products = [];

  }

  ngOnInit(): void {
    this.llamarUsuarioData();
  }

  llamarUsuarioData() {
    this.storage.currentMessage.subscribe((response: any) => {
      this.userRegister  = response;
      this.getDataUSerPay();

    });
  }


  openCart(data: any): void {

    this.dialog.open(CartComponent, {
      width: '700px',
      height: '500px',
      data: data
    });

  }

  deleteregister(item: any): void {


    this._crud.readGeneral('/favorite', 'id_favorite', item.id_favorite).then( ( response: any) => {
      response.subscribe(( res: any) => {
        this.colectionID  = res[0]?.payload.doc.id;

        this._crud.deleteColection('/favorite', this.colectionID ).then((response: any) => {
          this.alert.showToasterFull('El registro se quito del listado de Favoritos');

        })


      });

    })


  }

  redirectDetail(item: any): void {

    const url = item.nameProduct.toLowerCase().replaceAll(" ", '-').replaceAll(",", '');

    this.router.navigate([`/detail-product/${item.id}/${url}`]);

  }

  getDataUSerPay(): void {
    const data = this._crud.readDetailOrder('/favorite', 'user_id', this.userRegister.id);
    data.subscribe(( res: any) => {
      this.products = res;
    });
  }

}
