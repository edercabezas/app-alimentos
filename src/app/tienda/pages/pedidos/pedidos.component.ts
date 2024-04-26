import {Component, OnInit} from '@angular/core';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCard} from "@angular/material/card";
import {CurrencyPipe, DatePipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {DataPayUsers} from "../../interface/data-pay";
import {SesionService} from "../../services/sesion-global/sesion.service";
import {CrudService} from "../../services/crud/crud.service";

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [MatExpansionModule, MatCard, NgIf, RouterLink, NgForOf, DatePipe, JsonPipe, CurrencyPipe],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss'
})
export default class PedidosComponent implements OnInit{
  panelOpenState = false;
  public userRegister: any
  public colectionID: any
  public colectionIDProduct: any
  dataPay!: DataPayUsers;
  getOrderList: any;
  detailOrder: any;
  constructor(private storage: SesionService, private _crud: CrudService) {
  }

  ngOnInit(): void {

    this.setDataUser();
    this.llamarUsuarioData();
  }

  llamarUsuarioData() {
    this.storage.currentMessage.subscribe(response => {
      this.userRegister  = response;
      this.getDataUSerPay();
      this.getOrder();

    });
  }


  getDataUSerPay(): void {

    this._crud.readGeneral('/data_pay', 'user_id', this.userRegister?.id).then((response: any) => {
      response.subscribe(( res: any) => {
        const dataProduct = res[0]?.payload.doc.data();
        this.colectionID  = res[0]?.payload.doc.id;
        this.dataPay = dataProduct as DataPayUsers;

      });
    })

  }

  getOrder(): void {

    const data = this._crud.readDetailOrder('/order', 'user_id',  this.userRegister.id);
    data.subscribe( ( res: any) => {

      this.getOrderList = res;

    });

  }

 async getDetailOrder(id_order: any): Promise<any> {

   this.detailOrder = [];
    const data = this._crud.readDetailOrder('/detailOrder', 'order_id',  id_order);

    data.subscribe(async ( res: any) => {
      console.log(res)
      this.detailOrder = res;
      this.gotoTop();
    });

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

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
