import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilService } from './../../../core/service/util.service';
import { MessageService } from './../../../core/service/message/message.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-cookie-policy',
    templateUrl: './cookie-policy.component.html',
    styleUrls: ['./cookie-policy.component.scss']
})
export class CookiePolicyComponent implements OnInit, OnDestroy {

    previousUrl: string;
    headerTitle = '';
    constructor(
        private utilService: UtilService,
        private messageService: MessageService,
        private location: Location) {
        if (this.headerTitle === '') {
            this.headerTitle = localStorage.getItem('header_title');
        }
        localStorage.setItem('header_title', 'Cookie Policy');
        this.messageService.setKolsData('Cookie Policy');
    }

    ngOnInit() {
        this.previousUrl = this.utilService.previousUrl;
    }

    ngOnDestroy() {
        this.messageService.setKolsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);
    }

    goBack() {
        this.location.back();
    }

}
