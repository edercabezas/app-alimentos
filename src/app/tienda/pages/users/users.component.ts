import {Component, OnInit} from '@angular/core';
import {CrudService} from "../../services/crud/crud.service";
import {MatCard} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataPayUsers} from "../../interface/data-pay";
import {MatButton} from "@angular/material/button";
import {SesionService} from "../../services/sesion-global/sesion.service";
import {AlertService} from "../../services/alert/alert.service";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    MatButton
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export default class UsersComponent implements OnInit {
  dataPay!: DataPayUsers;
  userRegister: any;
  colectionID: any;

  constructor(private _crud: CrudService,
              private _storage: SesionService,
              private _alert: AlertService) {
  }

  ngOnInit(): void {
    this.setDataUser();
    this.llamarUsuarioData();
    this.getDataUSerPay();
  }

  validaForm(): boolean {
    return this.dataPay.nombre === ''
      || this.dataPay.apellido === ''
      || this.dataPay.barrio === ''
      || this.dataPay.ciudad === ''
      || this.dataPay.direccion === ''
      || this.dataPay.nombre === ''
      || this.dataPay.observation === ''
      || this.dataPay.telefono === '';
  }


  llamarUsuarioData() {
    this._storage.currentMessage.subscribe((response: any) => {
      this.userRegister = response;

      this.dataPay.correo = response.email;

    });
  }


  getDataUSerPay(): void {

    this._crud.readGeneral('/data_pay', 'user_id', this.userRegister.id).then((response: any) => {
      response.subscribe((res: any) => {
        const dataProduct = res[0].payload.doc.data();
        this.colectionID = res[0].payload.doc.id;
        this.dataPay = dataProduct as DataPayUsers;

      });
    })

  }

  validateOption(): void {
    if (this.colectionID) {
      this.updateUsers();
    } else {
      this.setDataPay();
    }
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

  setDataPay(): void {
    this.dataPay.id = this._crud.generateId();
    this.dataPay.user_id = this.userRegister.id;
    this._crud.setProduct('/data_pay', this.dataPay).then((response: any) => {

      if (response) {
        this._alert.showToasterFull('La información fue guardada exitosamente')
      }
    });
  }


  public updateUsers(): void {

    this._crud.update('/products', this.colectionID, this.dataPay).then(() => {
      this._alert.showToasterFull('Los datos fueron actualizados exitosamente');

    }).catch(() => {
      this._alert.showToasterError('Hubo un error al actualizar los datos');
    });
  }
}
