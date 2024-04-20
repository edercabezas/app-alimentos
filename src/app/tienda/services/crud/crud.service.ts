import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CrudService {


  constructor( private _auth: AngularFireAuth,
               private db: AngularFirestore) {

  }

  async read(table: string) {
    return this.db.collection(`${table}`).valueChanges();

  }

  async setProduct(table: string, product: any): Promise<any> {

    return this.db.collection(`${table}`).add(product);
  }

  async readGeneral(tabla: string, campo: any, value: number) {
    console.log(tabla, campo, value)
    return this.db.collection(`${tabla}`, ref => ref
      .where(campo, '==', value)
    ).snapshotChanges();
  }


  async update(table: string, value: any, datos: object) {
    this.db.doc(`${table}/${value}`).update(datos);
  }


  async setOrder(table: string, order: any): Promise<any> {
    return this.db.collection(`${table}`).add(order);
  }

  async setOrderNew(table: string, order: any): Promise<any> {
    return this.db.collection(`${table}`).add(order);
  }


  async setDetailOrder(table: string, detail: any): Promise<any> {
    return this.db.collection(`${table}`).add(detail);
  }


  readDetailOrder(tabla: string, campo: any, value: number): Observable<any[]> {

    return this.db.collection(`${tabla}`, ref => ref
      .where(campo, '==', value)
    ).valueChanges();
  }

  async setContactUs(table: string, contactus: any): Promise<any> {
    return this.db.collection(`${table}`).add(contactus);
  }


  async deleteColection(table: string, colectionID: any): Promise<any> {
    this.db.collection(`${table}`).doc(colectionID).delete();
  }
}
