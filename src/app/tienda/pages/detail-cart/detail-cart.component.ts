import {Component, OnInit} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {CartService} from "../../services/cart/cart.service";
import {AlertService} from "../../services/alert/alert.service";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatFabButton, MatMiniFabButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {DataPay} from "../../interface/data-pay";
import {CrudService} from "../../services/crud/crud.service";
import Swal from 'sweetalert2';
import {SesionService} from "../../services/sesion-global/sesion.service";
import {AuthComponent} from "../../component/auth/auth.component";
import {MatDialog} from "@angular/material/dialog";
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
    RouterLink
  ],
  templateUrl: './detail-cart.component.html',
  styleUrl: './detail-cart.component.scss'
})
export default class DetailCartComponent implements OnInit{

  public valorTotal: number;
  public dataCart: any;
  public userRegister: any

  dataPay!: DataPay;
  constructor(
    private cartS: CartService,
    private alert: AlertService,
    private router: Router,
    private storage: SesionService,
    public dialog: MatDialog,
    private crud: CrudService) {
    this.valorTotal = 0;
  }

  ngOnInit() {
    this.showDataCartStorage();
    this.showValueShopping();
    this.setDataUser();
    this.llamarUsuarioData();
  }


  showDataCartStorage(): void {
    this.cartS.currentMessage.subscribe((response: any) => {
      this.dataCart = response;
    });
  }

  public backButton(): void {
    this.router.navigate(['/']);
  }

  public deleteCard(items: any, i: number): void {
    this.cartS.deleteCard(items, i);
  }


  showValueShopping(): void {
    this.cartS.currentMessage.subscribe((response: any) => {
      if (response) {
        this.valorTotal = response.reduce((item1: any, item2: any) => {
          return item1 + (item2.price * item2.cantidad);
        }, 0);
      }
    });
  }


  public setPay(): void {

    if (!this.userRegister) {
      this.openModalLogin(1);
      return;
    }

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
        Swal.fire({
          title: "Muy bien!",
          text: "El pedido fue realizado de forma correcta.",
          icon: "success"
        });
        this.cartS.removeStorage();
        this.setDataUser();
        this.router.navigate(['/']);

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
    this.storage.currentMessage.subscribe(response => {

      if (typeof window !== 'undefined') {
        const storage: any = localStorage.getItem('authStore');
        const data = JSON.parse(storage ?? storage);
      }
      this.userRegister  = response;

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


  validaForm(): boolean {
    return this.dataPay.nombre === ''
      || this.dataPay.apellido === ''
      || this.dataPay.barrio === ''
      || this.dataPay.ciudad === ''
      || this.dataPay.direccion === ''
      || this.dataPay.nombre === ''
      || this.dataPay.telefono === '';
  }


  setDataUser(): void {

    this.dataPay = {
      id: '',
      apellido: '',
      barrio: '',
      ciudad: '',
      correo: '',
      direccion: '',
      nombre: '',
      telefono: ''
    }

  }
}
