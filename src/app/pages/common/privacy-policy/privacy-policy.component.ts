import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilService } from './../../../core/service/util.service';
import { Router } from '@angular/router';
import { MessageService } from './../../../core/service/message/message.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {

    previousUrl: string;
    headerTitle = '';
    backTitle = 'Back';
    isHeaderShow = true;

    constructor(
        private utilService: UtilService,
        private messageService: MessageService,
        private location: Location,
        private router: Router) {
        if (this.headerTitle === '') {
            this.headerTitle = localStorage.getItem('header_title');
        }
        localStorage.setItem('header_title', 'Privacy Policy');
        this.messageService.setKolsData('Privacy Policy');
    }

    ngOnInit() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        if (this.utilService.isLoggedIn()) {
            this.backTitle = 'Back to Home';
            this.isHeaderShow = false;
        } else {
            this.backTitle = 'Back';
            this.isHeaderShow = true;
        }
        this.previousUrl = this.utilService.previousUrl;
        console.log(this.headerTitle);
    }

    ngOnDestroy() {
        this.messageService.setKolsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);
    }

    goBack() {
        // this.location.back();
        // this.router.navigate(['']);
        if (this.utilService.isLoggedIn()) {
            // this.router.navigate(['']);
            localStorage.setItem('selectedEntity', 'kol');
            this.messageService.setSelectedEntityData('kol');
            this.router.navigate([`${environment.appPrefix}`]);
        } else {
            this.location.back();
        }
    }

}
