import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardsGuard implements CanActivate {

  authData: any;
  auth: boolean = false;


  constructor(private router: Router) {

    if (typeof window !== 'undefined') {

      this.authData = localStorage.getItem('authStore');
    }



    if (this.authData) {
      this.auth = true;
    } else {
      this.authData = false;
    }

  }
  canActivate(): boolean {

    let data: any

    if (this.authData) {
      data = JSON.parse(this.authData);
    }



    if (this.auth && (data && data.profile === 'Admin') ) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

}
