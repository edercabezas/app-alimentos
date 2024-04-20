import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AlertService} from "../alert/alert.service";
import {Cart} from "../../interface/cart";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private resulCard = new BehaviorSubject(null);
  currentMessage = this.resulCard.asObservable();
  carritoAnterior: Array<any>;
  addProductoCarrito: Array<any>;
  constructor(private alertS: AlertService) {

    this.showProductCart();
    this.carritoAnterior = [];
    this.addProductoCarrito = [];
  }
  public addCart(data: Cart): void {
    console.log(data)
    let dataCart: any;
    dataCart = localStorage.getItem('alimentos');
    this.carritoAnterior = JSON.parse(dataCart);
    this.addProductoCarrito.push(data);

    if (this.addProductoCarrito) {

      if (!this.carritoAnterior) {
        this.carritoAnterior = [];
      }

      this.carritoAnterior.push(data);
      localStorage.setItem('alimentos', JSON.stringify(this.carritoAnterior));

      this.alertS.showToasterFull('Producto agregado al Carrito de compras')
    } else {
      this.alertS.showToasterError('Acabas de agregar este producto al carrito');
    }

    this.addProductoCarrito = [];
    this.showProductCart();
  }

  public updateCart(data: Cart, indice: number, proceso: number): void {

    let items: any;
    let datos: any;
    items = localStorage.getItem('alimentos');
    items = JSON.parse(items);

    if (proceso === 1) {
      items[indice].product_amount++;
    } else {
      if (items[indice].product_amount > 1) {
        items[indice].product_amount--;
      } else {
        datos = 'Articulo agregado a la canasta no puede ser menor a 1 unidad';
      }
    }

    localStorage.setItem('alimentos', JSON.stringify(items));

    this.showProductCart();

  }

  public showProductCart(): void {
    let data: any;

    if (typeof window !== 'undefined') {
      data = localStorage.getItem('alimentos');
      this.resulCard.next(JSON.parse(data));
    }

  }


  public deleteCard(data: any, index: number): void {
    let carrito: any;
    let dataCarrito: any;
    let i: any;
    carrito = localStorage.getItem('alimentos');
    dataCarrito = JSON.parse(carrito);
    i = dataCarrito.indexOf(data);

    dataCarrito.splice(index, 1);


    localStorage.setItem('alimentos', JSON.stringify(dataCarrito));

    this.alertS.showToasterFull('Producto descartado exitosamente');
    this.showProductCart();
  }

  public removeStorage(): void {
    localStorage.removeItem('alimentos');
    this.showProductCart();

  }

}
