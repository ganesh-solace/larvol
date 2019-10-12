import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse, } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { timer } from 'rxjs/observable/timer';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import { UtilService } from './core/service/util.service';
import { Router } from '@angular/router';
import { MessageService } from './core/service/message/message.service';

@Injectable()
export class LarvolHttpInterceptor implements HttpInterceptor {

    timer: any;
    constructor(
        private utilService: UtilService,
        private router: Router,
        private messageService: MessageService
    ) {
        this.timer = timer(1000);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request to add the new header.
        const authReq = req.clone({
            setHeaders: {
                'Api-Token': `${this.utilService.getToken()}`,
            }
        });

        return next.handle(authReq).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // do stuff with response if you want
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401 || err.status === 403) {
                    this.utilService.clearLocalStorage();
                    this.messageService.setHttpLoaderStatus(false);
                    this.router.navigate(['/login']);
                }
            }
        }).finally(() => {
        });
    }

}

