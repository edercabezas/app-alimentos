import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {CurrencyPipe, NgIf} from "@angular/common";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {AlertService} from "../../services/alert/alert.service";
import {CartService} from "../../services/cart/cart.service";
import {Cart} from "../../interface/cart";
import {AuthComponent} from "../auth/auth.component";
import {Favorite} from "../../interface/favorite";
import {SesionService} from "../../services/sesion-global/sesion.service";
import {CrudService} from "../../services/crud/crud.service";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    NgIf,
    CurrencyPipe,
    MatMiniFabButton,
    MatFormField,
    MatInput,
    FormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit{

  valueForm: number = 1
  private carData!: Cart;
  setFavoriteData!: Favorite;
  userRegister: any;
  constructor(public dialogRef: MatDialogRef<CartComponent>,
              @Inject(MAT_DIALOG_DATA) public dataCart: any,
              private alert: AlertService,
              private _cart: CartService,
              public dialog: MatDialog,
              private storage: SesionService,
              private crud: CrudService) {
  }

  ngOnInit(): void {
    this.setCart();
    this._setFavorites();
    this.llamarUsuarioData();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  sumCart(status: boolean): void {

    if (status) {

        this.valueForm++;
    } else {

      if (this.valueForm > 1 ) {
        this.valueForm--;
      } else {
        this.alert.showToasterUpdate('Para agregar el producto al carrito la cantidad minima debe de ser 1');
      }
    }

    console.log(status)
  }

  setValueInput(): void {
    console.log( this.valueForm)
    if (this.valueForm === 0 || this.valueForm < 0) {
      this.valueForm = 1;
    }
  }


  addCart(): void {

    if (this.valueForm > this.dataCart.size) {
      this.alert.showToasterWarning('La cantidad no puede ser mayor a la disponible');
      return;
    }

    this.carData.id = this.dataCart.id;
    this.carData.img = this.dataCart.img;
    this.carData.nameProduct = this.dataCart.nameProduct;
    this.carData.prefijo = this.dataCart.prefijo;
    this.carData.price = this.dataCart.price;
    this.carData.size = this.dataCart.size;
    this.carData.value_prefijo = this.dataCart.value_prefijo;
    this.carData.code = this.dataCart.code;
    this.carData.category = this.dataCart.category;
    this.carData.cantidad = this.valueForm;


    this._cart.addCart(this.carData)

  }

  setCart(): void {
    this.carData = {
      id: '',
      price: 0,
      size: 0,
      img: '',
      cantidad: 0,
      nameProduct: '',
      code: '',
      category: 0,
      prefijo: '',
      value_prefijo: ''
    }
  }


  llamarUsuarioData() {
    this.storage.currentMessage.subscribe(response => {
      this.userRegister  = response;

    });
  }


  public setFavorite(data: any): void {

    console.log(data)

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

    console.log(this.setFavoriteData)


    this.crud.setProduct('/favorite', this.setFavoriteData).then((response: any) => {

      if (response) {
        this.alert.showToasterFull('El producto se agrego a tus favoritos');

      }


    }).catch((error: any) => {
      console.log('Error al agregar a tus favoritos', error);
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
