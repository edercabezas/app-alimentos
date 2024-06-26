import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CrudService} from "../../services/crud/crud.service";
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {NgFor, NgIf} from "@angular/common";
import {CartComponent} from "../cart/cart.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    MatIcon,
    FormsModule,
    MatButton,
    NgFor,
    NgIf
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit{
  products: any[];
  statusProduct: boolean = true;
  dataBuscador: any;
  recorerBusqueda: any[];
  producto: any;
  mostrarBuscador: boolean = false;
  url: any;
  mostrarResultados: boolean;
  dominio: any;
  constructor(
              private _crud: CrudService,
              public dialog: MatDialog,
              private _router: Router) {
    this.mostrarResultados =  false;
    this.dominio = '';
    this.products = [];
    this.recorerBusqueda = [];
  }

  ngOnInit(): void {

    this.dataBuscador = null;
    this.getProducts();

  }

  buscadorProductos(e: any) {
  }

  ocultarInformacionBuscador() {

    if (this.dataBuscador) {
      this.mostrarResultados = true;
      const  data: any = document.getElementById('validationDefaultUsername');
      data.focus();
      this.showSearchResults();
    }


  }

  perderFocusOcultarResulBusqueda() {
   const data: any =  document.getElementById('validationDefaultUsername');
   data.blur()
    this.mostrarResultados = false
  }


  getProducts(): void {
    this.products = [];
    this._crud.readSearch('/products').then((response: any) => {

      response.subscribe((res: any) => {
        this.products = res;
        this.statusProduct = false;

      });


    }).catch((error: any) => {
      this.statusProduct = false;
    })
  }


  showSearchResults() {

      this.recorerBusqueda = this.products.filter( (res: any) => {

        return  res.nameProduct.toLowerCase().includes(this.dataBuscador.toLowerCase());
      });


  }

  listadoProductoTotal(item: any) {

    this.mostrarResultados = true;
    this.mostrarBuscador = false;

    const url = item.nameProduct.toLowerCase().replaceAll(" ", '-').replaceAll(",", '');
    this._router.navigate([`/detail-product/${item.id}/${url}`]);
    const data: any  = document.getElementById('validationDefaultUsername');
    data.blur();
    this.mostrarResultados = false

    this.limpiarFormulario()

  }

  public limpiarFormulario(): void {
    const data: any =  document.getElementById("validationDefaultUsername");
    data.reset();
  }

  openCart(data: any): void {
   // this.limpiarFormulario();

    this.dialog.open(CartComponent, {
      width: '700px',
      height: '500px',
      data: data
    });

  }
}

