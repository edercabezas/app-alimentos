import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private dataSubject = new Subject<any>();
  public data$ = this.dataSubject.asObservable();
  constructor() { }

  sendData(data: any): void {
    console.log(data)
    this.dataSubject.next(data);
  }
}
