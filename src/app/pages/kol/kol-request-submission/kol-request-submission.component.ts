import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilService } from './../../../core/service/util.service';
import { Router } from '@angular/router';
import { MessageService } from './../../../core/service/message/message.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-kol-request-submission',
    templateUrl: './kol-request-submission.component.html',
    styleUrls: ['./kol-request-submission.component.scss']
})
export class KolRequestSubmissionComponent implements OnInit, OnDestroy {

    previousUrl: string;
    headerTitle = '';

    constructor(
        private utilService: UtilService,
        private messageService: MessageService,
        private router: Router,
        private location: Location
    ) {
        if (this.headerTitle === '') {
            this.headerTitle = localStorage.getItem('header_title');
        }
        localStorage.setItem('header_title', 'Kol Request');
        this.messageService.setKolsData('Kol Request');
        if (localStorage.getItem('KisKOLRequest') === null || localStorage.getItem('KisKOLRequest') === undefined) {
            this.router.navigate(['']);
        }
    }

    ngOnInit() {
        this.previousUrl = this.utilService.previousUrl;
        console.log(this.headerTitle);
    }

    ngOnDestroy() {
        this.messageService.setKolsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);
        localStorage.removeItem('KisKOLRequest');
    }

    /**
     * Go back to home page
     */
    gotoHome() {
        this.router.navigate(['']);
    }

    goBack() {
        this.location.back();
    }

}
