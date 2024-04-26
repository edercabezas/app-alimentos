import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {User} from "../../interface/user";
import {Login} from "../../interface/login";
import {AuthService} from "../../services/auth/auth.service";
import {AlertService} from "../../services/alert/alert.service";
import {Router} from "@angular/router";
import {SesionService} from "../../services/sesion-global/sesion.service";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    NgIf,
    MatButton,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatIconButton,
    FormsModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit{
  hide = true;
  typeForm: number = 1;
  email: string = '';
  password: string = '';
  userCode: string = '';
  statusButton: boolean = false;

  public userRegister!: User;
  public loginUser!: Login;

  constructor(public dialogRef: MatDialogRef<AuthComponent>,
              @Inject(MAT_DIALOG_DATA) public dataCart: any,
              private _auth: AuthService,
              private _alert: AlertService,
              private _router: Router,
              private _storage: SesionService) {
    this.typeForm = this.dataCart.item;

    console.log(this.dataCart.item)
  }
  ngOnInit(): void {

    this._setCreateUSer();


    this.loginUser = {
      email: '',
      password: ''
    }
  }


  public resetForm(value: number): void {
    this.typeForm = value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public login(): void {
    this.statusButton =  true;
    this._auth.login(this.loginUser.email, this.loginUser.password).then((response: any) => {

      if (response) {
        this.userCode = response.user.uid;
        this._auth.redUser('/users', this.userCode).then((res: any) => {

          res.subscribe((res2: any) => {
            res2.forEach(async ( value: any) => {
              const data = res2[0].payload.doc.data();
              this.userRegister = data as User;

              localStorage.setItem('authStore', JSON.stringify(this.userRegister));
              this.statusButton = false;
              this._storage.changeMessage();

              if (this.userRegister.profile === 'Customer') {
                this.onNoClick();

              } else {
                this.onNoClick();
                this._router.navigateByUrl('/products');
              }
            });
          });



        }).catch((error: any) => {

          console.log('error', error)
        })
      }

    }).catch((error: any) => {
      this.statusButton = false
      console.log('error', error)
      this._alert.showToasterError('Hubo un Error, validar que los datos ingresados sean correctos');
    }).finally(() => this.statusButton = false);
  }

  public createUser(): void {
    this.statusButton = true
    this.userRegister.id = new Date().getTime() + new Date().getUTCMilliseconds();
    this._auth.registerUSerFirebase(this.userRegister).then((response: any) => {

      if (response) {
        this.userRegister.code = response.user.uid;

        this._auth.setUser('/users', this.userRegister).then((response: any) => {
          if (response) {
            this.statusButton = false
            this.setAuthUser();
            this._setCreateUSer();
            this._alert.showToasterFull('El Usuario se creo exitosamente');


          }

        }).catch((error: any) => {
          console.log('Error al guardar los datos del usuario', error);
        })

      }


    }).catch((error: any) => {
      this._alert.showToasterError('El correo ingresado ya existe o no es Valido, por favor validar nuevamente');
      this.statusButton = false
    }).finally(() => this.statusButton = false);

  }

  setAuthUser(): void {
    this.loginUser.email = this.userRegister.email;
    this.loginUser.password = this.userRegister.password;

    this.login();
  }

  private _setCreateUSer(): void {
    this.userRegister = {
      id: 0,
      email: '',
      password: '',
      userName: '',
      profile: 'Customer',
      code: '',
      img: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y'
    };
  }
}
