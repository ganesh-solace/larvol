import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { UtilService } from './../service/util.service';

export interface ComponentCanDeactivate {
    hasChanges: () => boolean | Observable<boolean>;
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private _router: Router,
        private utilService: UtilService) {
    }

    /**
     * User is login or not for access route
     */
    canActivate(): boolean {
        if (this.utilService.isLoggedIn()) {
            return true;
        } else {
            this._router.navigate(['']);
            return false;
        }
    }
}
