import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UtilService } from './../service/util.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AnonymousGuardService implements CanActivate {

    constructor(
        private router: Router,
        private utilService: UtilService) { }

    /**
     * check user login or not if login than redirect on home page
     * @param route
     * @param state
     */
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
            if (!this.utilService.isLoggedIn()) {
                return true;
            } else {
                this.router.navigate([`${environment.appPrefix}`]);
                return false;
            }
    }
}
