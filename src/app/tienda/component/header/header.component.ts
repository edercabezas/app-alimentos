import {Component, OnInit} from '@angular/core';
import {MatToolbar, MatToolbarModule} from "@angular/material/toolbar";
import {MatMenu, MatMenuModule} from "@angular/material/menu";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatBadge} from "@angular/material/badge";
import {JsonPipe, NgIf} from "@angular/common";
import {SearchComponent} from "../search/search.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthComponent} from "../auth/auth.component";
import {Router, RouterLink} from "@angular/router";
import {SesionService} from "../../services/sesion-global/sesion.service";
import {User} from "../../interface/user";
import {CategorysComponent} from "../categorys/categorys.component";
import {CartService} from "../../services/cart/cart.service";
import {ReloadComponent} from "../reload/reload.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatMenu,
    MatToolbar,
    MatIcon,
    MatButton,
    MatIconButton,
    MatToolbarModule,
    MatBadge,
    NgIf,
    SearchComponent,
    MatMenuModule,
    JsonPipe,
    CategorysComponent,
    RouterLink,
    ReloadComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  public authData: any;
  public userRegister: any
  showScroll: boolean;
  public valorCantidad: number;
  public setProduct: boolean = true;
  constructor(public dialog: MatDialog,
              private router: Router,
              private storage: SesionService,
              private cartS: CartService) {
    this.showScroll = true;
    this.valorCantidad = 0;
  }
  ngOnInit(): void {
    this.llamarUsuarioData();
    this.showAmountProductCart();
  }


  redirectUSer(url: string): void {
    if ( this.userRegister) {
      this.router.navigate([`/${url}`]);
      return;
    }

    this.openModalLogin( 1 );
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

  llamarUsuarioData() {
    this.storage.currentMessage.subscribe(response => {
      this.userRegister  = response;

    });
  }


  public closeGenFuego(): void {
    this.setProduct =  true;


    localStorage.removeItem('authStore');
    this.storage.changeMessage();
    this.authData =  null;
    this.userRegister = null;
    this.router.navigate(['/']);

  }
  menuMobilShow(): void{
    this.showScroll = !this.showScroll;
  }

  public checkCategory(category: any): void {
    this.showScroll = !this.showScroll;
    const btnNav: any  = document.getElementById('btn-nav');
    btnNav.click();
  }


  showAmountProductCart(): any {
    this.cartS.currentMessage.subscribe((response: any) => {
      if (response) {
        this.valorCantidad = response.reduce((item1: any, item2: any) => {
          return item1 + item2.cantidad;
        }, 0);
      }
    });

  }
}
