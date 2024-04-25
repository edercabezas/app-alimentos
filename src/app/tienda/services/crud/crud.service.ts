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


  public generateId(): any {

    let getDay = new Date().getDay().toString();
    const constGetMonth = new Date().getMonth() + 1;
    let getHours = new Date().getHours().toString();
    let getMinutes = new Date().getMinutes().toString();
    const getFullYear =new Date().getFullYear().toString();
    let getMonth = constGetMonth.toString()

    if (getDay.length === 1) {
      getDay = '0'+getDay;
    }

    if (getMonth.length === 1) {
      getMonth = '0'+getMonth;
    }

    if (getMonth.length === 1) {
      getHours = '0'+getHours;
    }

    if (getMinutes.length === 1) {
      getMinutes = '0'+getMinutes;
    }


    const dataFinish = `${getDay}${getMonth}${getFullYear}${getHours}${getMinutes}`;

    return dataFinish.toString();

  }

}
