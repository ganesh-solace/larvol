import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from './../../../core/service/util.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { LoginService } from './../../../core/service/login/login.service';
import { MessageService } from './../../../core/service/message/message.service';

@Component({
    selector: 'app-sign-out-modal',
    templateUrl: './sign-out-modal.component.html',
    styleUrls: ['./sign-out-modal.component.scss']
})
export class SignOutModalComponent implements OnInit {

    constructor(
        private renderer: Renderer2,
        private utilService: UtilService,
        private router: Router,
        private activeModal: NgbActiveModal,
        private location: Location,
        private loginService: LoginService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
    }

    /**
     * signout user and redirect on login screen
     */
    signOut() {
        this.activeModal.close();
        this.messageService.setHttpLoaderStatus(true);
        this.renderer.removeClass(document.body, 'bodyFixed');
        this.loginService.removeDeviceToken()
        .then((resonse: any) => {
            if (resonse['success']) {
                this.loginService.logout()
                .then((res: any) => {
                    if (res['success']) {
                        this.utilService.clearLocalStorage();
                        this.router.navigate(['/login']);
                    }
                }).catch((err: any) => {
                    console.log(err);
                    this.utilService.showError('Error', 'Something went wrong. Please try again later');
                });
            }
        }).catch((err: any) => {
            console.log(err);
            // this.utilService.showError('Error', 'Something went wrong. Please try again later'); 
        });
    }

    close() {
        this.activeModal.close();
        // this.renderer.removeClass(document.body, 'bodyFixed');
        // this.location.back();
    }

}
