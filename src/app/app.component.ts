import { Component, OnInit, TemplateRef, ViewChild, Inject, HostListener } from '@angular/core';
import { MessageService } from './core/service/message/message.service';
import { UtilService } from './core/service/util.service';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { PushNotificationsService } from './core/service/push-notifications/push-notifications.service';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs/observable/interval';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModelComponent } from './pages/common/message-model/message-model.component';
import { DOCUMENT } from '@angular/platform-browser';
import { PlatformLocation } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    isShow = true;
    isFooterShow = true;
    showBtn: Boolean = false;
    loggedUserData: any;
    activeModal: any;
    windowScrolled: boolean;

    constructor(
        private utilService: UtilService,
        private router: Router,
        private _notificationService: PushNotificationsService,
        private swUpdate: SwUpdate,
        private messageService: MessageService,
        private modalService: NgbModal,
        private location: PlatformLocation,
        @Inject(DOCUMENT) private document: Document
        ) {

            this.location.onPopState(() => {
                console.log('pressed back!');
                localStorage.removeItem('showDrugDetail');
                this.messageService.setBrowserBackStatus(true);
            });

        if (swUpdate.isEnabled) {
            interval(5 * 60 * 60).subscribe(() => swUpdate.checkForUpdate()
                .then(() => console.log('checking for updates')));
        }

        this.swUpdate.available.subscribe(event => this.promptUser());

        this.messageService.getHttpLoaderStatus().subscribe(res => {
            this.isShow = res;
            if (this.utilService.isLoggedIn()) {
                if (this.router.url !== '/signup-success') {
                    this.isFooterShow = false;
                }
            } else {
                if (this.router.url === '/') {
                    this.isFooterShow = false;
                } else {
                    this.isFooterShow = true;
                }
            }
        });

        if (environment.showLog) {
            console.log = function() {};
        }

        this.loggedUserData = this.utilService.getLoggedUserData();
        if (this.loggedUserData !== null && this.loggedUserData !== undefined && this.loggedUserData !== '') {
            this._notificationService.requestPermission(this.loggedUserData.id);
        }
        this._notificationService.receiveMessage();
    }

    @HostListener('window:unload', [ '$event' ])
    unloadHandler(event: any) {
        localStorage.removeItem('selectedEntity');
    }

    @HostListener('window:beforeunload', [ '$event' ])
    beforeUnloadHander(event: any) {
        localStorage.removeItem('selectedEntity');
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
            this.windowScrolled = true;
        } else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
            this.windowScrolled = false;
        }
    }

    scrollToTop() {
      console.log('scroll');
        (function smoothscroll() {
            const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScroll > 0) {
                window.requestAnimationFrame(smoothscroll);
                window.scrollTo(0, currentScroll - (currentScroll / 8));
            }
        })();
    }


    private promptUser(): void {
        console.log('updating to new version');
        const isInWebAppChrome = (window.matchMedia('(display-mode: standalone)').matches);
        this.swUpdate.activateUpdate().then(() => {
            // alert('New update available');
            if (this.activeModal) {
                this.activeModal.close();
            }
            if (this.utilService.checkRunningPlatformType() && isInWebAppChrome) {
                this.activeModal = this.modalService.open(MessageModelComponent, { size: 'sm', windowClass: 'new_update_popup'});
                this.activeModal.componentInstance.message = 'New Update Available. Please close and restart application.';
                this.activeModal.componentInstance.type = 'mobile';
            } else {
                this.activeModal = this.modalService.open(MessageModelComponent, { size: 'sm', windowClass: 'new_update_popup'});
                this.activeModal.componentInstance.message = 'New updates are available. Please refresh the page.';
                this.activeModal.componentInstance.type = 'web';
            }
        });
    }

    ngOnInit() {
        this.router.events.subscribe((res) => {
            if (this.router.url === '/signup-success') {
                this.isFooterShow = true;
            }
            if (this.router.url === '/') {
                this.isFooterShow = false;
            }
        });
        if (this.utilService.isLoggedIn()) {
            if (this.router.url !== '/signup-success') {
                this.isFooterShow = false;
            }
        } else {
            if (this.router.url === '/') {
                this.isFooterShow = false;
            } else {
                this.isFooterShow = true;
            }
        }
    }
}
