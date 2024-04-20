import { Pipe, PipeTransform } from '@angular/core';
import {ApisService} from "../services/api/apis.service";

@Pipe({
  name: 'fechaNombre',
  standalone: true
})
export class FechaNombrePipe implements PipeTransform {


  constructor(private api: ApisService) {
  }
  transform(fechaCadena: any): string {

    fechaCadena = this.api.getClearDate(fechaCadena) + ' 00:00:00';

    const dias = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];

    const numberDay = new Date(fechaCadena).getDay();
    return dias[numberDay]
  }

}
