import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {CurrencyPipe, NgIf} from "@angular/common";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {AlertService} from "../../services/alert/alert.service";
import {CartService} from "../../services/cart/cart.service";
import {Cart} from "../../interface/cart";

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
  constructor(public dialogRef: MatDialogRef<CartComponent>,
              @Inject(MAT_DIALOG_DATA) public dataCart: any,
              private alert: AlertService,
              private _cart: CartService) {
  }

  ngOnInit(): void {
    this. setCart();
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


    console.log(this.dataCart);

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
}
