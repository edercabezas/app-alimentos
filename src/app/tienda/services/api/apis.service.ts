import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApisService {

  private API_UBICACION = 'https://api.ipbase.com/v1/json/';

  constructor(private httpC: HttpClient) { }

  async getUbicacion(): Promise<any> {

    const response = await fetch(this.API_UBICACION);
    return await response.json();
  }


  async read(): Promise<any> {

    return new Promise((resolve, reject) => {

      return this.httpC.get(this.API_UBICACION).subscribe( (response: any) => {

          return resolve(response);
        }

      );

    });

  }


  // async obtenerDatosClima(longitud: any, latitud: any): Promise<any> {
  //
  //   const TIEMPO: any = `https://www.7timer.info/bin/civillight.php?lon=${longitud}&lat=${latitud}&ac=0&unit=metric`;
  //
  //
  //     return new Promise((resolve, reject) => {
  //       return this.httpC.get(`${TIEMPO}`).subscribe({
  //         next: (response: any) => {
  //           if (response.data) {
  //             response = response.json();
  //           }
  //
  //           resolve(response);
  //         },
  //         error: error => reject(error)
  //       });
  //     });
  //
  //     }


    async obtenerDatosClima(longitud: any, latitud: any): Promise<any> {
      const TIEMPO: any = `https://www.7timer.info/bin/civillight.php?lon=${longitud}&lat=${latitud}&ac=0&unit=metric&output=json`;

      const  response = await fetch(TIEMPO)
      return await response.json();
    }

  public getClearDate(value: any): any {
    value = "" + value;

    if (!value) {
      return "";
    }

    const year = value.substring(0, 4);
    const month = value.substring(4, 6);
    const day = value.substring(6, 8);

    return `${year}-${month}-${day}`;

  }
}
