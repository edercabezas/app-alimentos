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
  constructor( private crud: CrudService,
               private alert: AlertService,
               private imgFir: AngularFireStorage,
               private activatedRoute: ActivatedRoute,
               private router: Router,
               public dialog: MatDialog) {
  }
  ngOnInit(): void {

    this.activatedRoute.params.subscribe((value: any) => {
      if (value.id) {
        this.idUrlProduct = value.id;
        this._getProduct(value.id);
      }

    });
  }


  async _getProduct(id: any): Promise<any>  {

    this.reload = true
    this.crud.readGeneral('/products', 'id', id).then( ( response: any) => {
      response.subscribe(( res: any) => {
        const dataProduct = res[0]?.payload?.doc.data();
        this.setProduct = dataProduct as Products;

      });

    }).catch((error: any) => {
      console.log(error);
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
}
