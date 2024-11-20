import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(
      private routes: Router
  ) { }

  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if(state.url === '/check-code' || state.url === '/set-password'){

        if (localStorage.getItem('resetpassword')) {

          return true;

        } else {

          this.routes.navigate(['/reset-password']);

        }

      }else{

        if (localStorage.getItem('MATCHEDFOREVERF')) {

          return true;

        } else {

          this.routes.navigate(['/login']);

        }

      }
    }
    
}
