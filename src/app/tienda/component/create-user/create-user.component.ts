import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import { MatInputModule} from "@angular/material/input";
import {User} from "../../interface/user";
import {AuthService} from "../../services/auth/auth.service";
import {AlertService} from "../../services/alert/alert.service";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    NgIf,
    MatButton,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatIconButton,
    FormsModule,
    MatOption,
    MatSelect
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export  class CreateUserComponent implements  OnInit{
  public userRegister!: User;
  hide:boolean = true;
  statusButton: boolean = false;
  numberOption: number = 0;
  constructor(public dialogRef: MatDialogRef<CreateUserComponent>,
              @Inject(MAT_DIALOG_DATA) public dataCart: any,
              private _auth: AuthService,
              private _alert: AlertService,
              private router: Router,) {
  }
  ngOnInit(): void {
    this._setCreateUSer();
    this.numberOption = this.dataCart.item.value;

    if (this.dataCart.item.value === 2) {
      this.userRegister = this.dataCart.item.item;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  public createUser(): void {
    this.statusButton = true;
    this.userRegister.id = new Date().getTime() + new Date().getUTCMilliseconds();
    this._auth.registerUSerFirebase(this.userRegister).then((response: any) => {

      if (response) {
        this.userRegister.code = response.user.uid;

        this._auth.setUser('/users', this.userRegister).then((response: any) => {
          if (response) {
            this._setCreateUSer();
            this._alert.showToasterFull('El Usuario se creo exitosamente');

            this.statusButton = false;

            this.onNoClick();
          }


        }).catch(() => {
          this._alert.showToasterError('Error al guardar los datos del usuario');
          this.statusButton = false;
        })

      }


    }).catch((error: any) => {
      this.statusButton = false;
      this._alert.showToasterError('El correo ingresado ya existe o no es Valido, por favor validar nuevamente');
    });

  }

  public actualizar(): void {

  }


  private _setCreateUSer(): void {
    this.userRegister = {
      id: 0,
      email: '',
      password: '',
      userName: '',
      profile: 'Admin',
      code: '',
      img: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y'
    };
  }
}
