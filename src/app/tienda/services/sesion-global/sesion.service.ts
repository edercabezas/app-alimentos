import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  private data = new BehaviorSubject(null);
  currentMessage = this.data.asObservable();
  //data: any;

  changeMessage() {

    this.consultarDatosLocales();
  }

  constructor() {

    this.consultarDatosLocales();

  }

  consultarDatosLocales() {

    if (typeof window !== 'undefined') {
      const storage: any = localStorage.getItem('authStore');
      const data = JSON.parse(storage ?? storage);
      this.data.next(data) ;
    }

  }
}
