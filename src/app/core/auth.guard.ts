import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild
} from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { AuthService } from 'app/core/auth.service';

/**
 * Defends those routes, where the log in is required.
 */
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  /**
   *Initializes the need services.
   */
  constructor(private authSVC: AuthService, private router: Router) {}

  /**
   * Decides wether the user is logged in to the Authentication service or not.
   * If the user is not authenticated, it gets redirected to the sign in page.
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.authSVC.user
      .take(1)
      .map(user => !!user)
      .do(loggedIn => {
        if (!loggedIn) {
          console.log('access denied');
          this.router.navigate(['/signin']);
        }
      });
  }

  /**
   * Child routes are also guarded by calling the parent guard method.
   */
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.canActivate(next, state);
  }
}
