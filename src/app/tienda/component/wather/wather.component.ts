import {Component, OnInit} from '@angular/core';
import {ApisService} from "../../services/api/apis.service";
import {MatCard} from "@angular/material/card";
import {Clima} from "../../interface/clima";
import {JsonPipe, NgFor, NgIf} from "@angular/common";
import {FechaNombrePipe} from "../../pipe/fecha-nombre.pipe";
import {EstadoDayPipe} from "../../pipe/estado-day.pipe";
import {AlertService} from "../../services/alert/alert.service";

@Component({
  selector: 'app-wather',
  standalone: true,
  imports: [
    MatCard,
    NgFor,
    NgIf,
    JsonPipe,
    FechaNombrePipe,
    EstadoDayPipe
  ],
  templateUrl: './wather.component.html',
  styleUrl: './wather.component.scss'
})
export class WatherComponent implements OnInit{


  city: string;
  deparment: string;
  country: string;
  hours: string;
  detailNow!: Clima;
  detailNewDay: Clima[];
  constructor(private api: ApisService, private alert: AlertService) {

    this.city = '';
    this.deparment = '';
    this.country = '';
    this.hours = '';

    this.detailNewDay =[]
  }
  ngOnInit(): void {
    this.setClima();
    this.getUbication();

  //  this.read();

  }

  public getUbication(): void {



    this.api.getUbicacion().then((response: any) => {

      this.city = response.city;
      this.deparment = response.region_name;
      this.country = response.country_name;


      this._getObtenerClima(response.longitude, response.latitude);


    }).catch(() => {

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((response: any) => {
          this._getObtenerClima(response.coords.longitude, response.coords.latitude);
        });

      }

    });


  }

  private _getObtenerClima(setLongitud: any, setLatitudes: any): void {


    this.api.obtenerDatosClima(setLongitud, setLatitudes).then((response: any) => {

      console.log(response)

      this.detailNow = response.dataseries.splice(0, 1)[0];
      this.detailNewDay = response.dataseries;


    }).catch((error: any) => {
      console.log(error);
      this.alert.showToasterWarning('En estos momento el servicio encargado de mostrar el clima esta respondiendo')
    });
  }


  public returnImg(img: string): string {

    return `assets/img/clima/${img}.png`
  }


  setClima(): void {

    this.detailNow = {
      temp2m: {
        min: 0,
        max: 0
      },
      date: '',
      weather: '',
      wind10m_max: 0
    };
  }
}
