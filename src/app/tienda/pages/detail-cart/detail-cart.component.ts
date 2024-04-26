import {Component, OnInit} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {CartService} from "../../services/cart/cart.service";
import {CurrencyPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatFabButton, MatMiniFabButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CrudService} from "../../services/crud/crud.service";
import Swal from 'sweetalert2';
import {SesionService} from "../../services/sesion-global/sesion.service";
import {AuthComponent} from "../../component/auth/auth.component";
import {MatDialog} from "@angular/material/dialog";
import {DataPayUsers} from "../../interface/data-pay";
import {Order} from "../../interface/order";
import {DetailOrder} from "../../interface/detail-order";
import {Products} from "../../interface/products";

@Component({
  selector: 'app-detail-cart',
  standalone: true,
  imports: [
    MatCard,
    NgForOf,
    MatIcon,
    MatMiniFabButton,
    CurrencyPipe,
    MatFabButton,
    MatButton,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    RouterLink,
    JsonPipe
  ],
  templateUrl: './detail-cart.component.html',
  styleUrl: './detail-cart.component.scss'
})
export default class DetailCartComponent implements OnInit {

  public valorTotal: number;
  public dataCart: any[];
  public userRegister: any
  public colectionID: any
  public colectionIDProduct: any
  dataPay!: DataPayUsers;
  setOrderData!: Order;
  setOrDetailOrderData!: DetailOrder;
  getDataProduct!: Products;

  constructor(
    private _cart: CartService,
    private _router: Router,
    private _storage: SesionService,
    public dialog: MatDialog,
    private _crud: CrudService) {
    this.valorTotal = 0;
    this.dataCart = []

    this.getDataProduct = {} as Products;
  }

  ngOnInit() {
    this.showDataCartStorage();
    this.showValueShopping();
    this.llamarUsuarioData();
    this.setDataUser();
    this.setreateOrder();

  }


  showDataCartStorage(): void {
    this._cart.currentMessage.subscribe((response: any) => {

      if (response) {
        this.dataCart = response;
      } else {
        this.dataCart = [];
      }

    });
  }

  public backButton(): void {
    this._router.navigate(['/']);
  }

  public deleteCard(items: any, i: number): void {
    this._cart.deleteCard(items, i);
  }


  showValueShopping(): void {
    this._cart.currentMessage.subscribe((response: any) => {
      if (response) {
        this.valorTotal = response.reduce((item1: any, item2: any) => {
          return item1 + (item2.price * item2.cantidad);
        }, 0);
      }
    });
  }

  public setPay(): void {

    Swal.fire({
      title: "¿Está seguro?",
      text: "Al precionar continuara se realizara el pedido!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, continuar!",
      cancelButtonText: "Cancelar!"

    }).then((result) => {
      if (result.isConfirmed) {

        this.crearOrden();

      } else {
        Swal.fire({
          title: "Cancelado!",
          text: "El pedido se ha cancelado.",
          icon: "error"
        });
      }
    });

  }


  llamarUsuarioData() {
    this._storage.currentMessage.subscribe(response => {
      this.userRegister = response;
      this.getDataUSerPay();

    });
  }


  public crearOrden(): void {

    const dateOrder = new Date();
    this.setOrderData.id = this._crud.generateId();
    this.setOrderData.id_data_user = this.dataPay.id;
    this.setOrderData.date_order = dateOrder.toISOString();
    this.setOrderData.user_id = this.userRegister?.id;

    this._crud.setProduct('/order', this.setOrderData).then((response: any) => {

      if (response) {
        this.crearDetalleOrden(this.setOrderData.id);
        //this.actualizarProducto();
      }

    })


  }

  public crearDetalleOrden(order: number): void {
    this.getDataProductCart();
    this.dataCart.forEach((detail: any) => {


      this.setOrDetailOrderData.detail_id = this._crud.generateId();
      this.setOrDetailOrderData.order_id = order;
      this.setOrDetailOrderData.img = detail.img;
      this.setOrDetailOrderData.price = detail.price;
      this.setOrDetailOrderData.id_producto = detail.id;
      this.setOrDetailOrderData.value_prefijo = detail.value_prefijo;
      this.setOrDetailOrderData.prefijo = detail.prefijo;
      this.setOrDetailOrderData.cantidad = detail.cantidad;
      this.setOrDetailOrderData.category = detail.category;
      this.setOrDetailOrderData.nameProduct = detail.nameProduct;

      this._crud.setProduct('/detailOrder', this.setOrDetailOrderData);


    });


  }

  getDataProductCart(): void {

    this.dataCart.forEach((product: any) => {

      this.colectionIDProduct = product._id;
      this.getDataProduct.size = product.size - product.cantidad;

      this._crud.update('/products', this.colectionIDProduct, this.getDataProduct).then(() => {

        Swal.fire({
          title: "Muy bien!",
          text: "El pedido fue realizado de forma correcta.",
          icon: "success"
        });
      });
    });

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

  getDataUSerPay(): void {

    this._crud.readGeneral('/data_pay', 'user_id', this.userRegister?.id).then((response: any) => {
      response.subscribe((res: any) => {
        const dataProduct = res[0].payload.doc.data();
        this.colectionID = res[0].payload.doc.id;
        this.dataPay = dataProduct as DataPayUsers;

      });
    })
  }

  setDataUser(): void {

    this.dataPay = {
      user_id: 0,
      id: '',
      apellido: '',
      barrio: '',
      ciudad: '',
      correo: '',
      direccion: '',
      nombre: '',
      telefono: '',
      observation: '',
    }

  }

  setreateOrder(): void {
    this.setOrderData = {
      id: 0,
      user_id: 0,
      date_order: '',
      id_data_user: '',
      status: 'PENDIENTE'
    };
    this.setOrDetailOrderData = {
      img: '',
      price: 0,
      nameProduct: '',
      category: 0,
      detail_id: 0,
      cantidad: 0,
      order_id: 0,
      prefijo: '',
      value_prefijo: '',
      description: '',
      id_producto: ''
    };


  }

}
