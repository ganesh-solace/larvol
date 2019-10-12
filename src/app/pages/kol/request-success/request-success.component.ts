import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilService } from './../../../core/service/util.service';
import { Router } from '@angular/router';
import { MessageService } from './../../../core/service/message/message.service';

@Component({
    selector: 'app-request-success',
    templateUrl: './request-success.component.html',
    styleUrls: ['./request-success.component.scss']
})
export class RequestSuccessComponent implements OnInit, OnDestroy {

    previousUrl: string;
    headerTitle = '';

    constructor(
        private utilService: UtilService,
        private messageService: MessageService,
        private router: Router) {
        if (this.headerTitle === '') {
            this.headerTitle = localStorage.getItem('header_title');
        }
        localStorage.setItem('header_title', 'Contact Sales Team');
        this.messageService.setKolsData('Contact Sales Team');

        if (localStorage.getItem('KisRequestExist') === null || localStorage.getItem('KisRequestExist') === undefined) {
            // this.router.navigate(['']);
        }
    }

    ngOnInit() {
        this.previousUrl = this.utilService.previousUrl;
        console.log(this.headerTitle);
    }

    ngOnDestroy() {
        this.messageService.setKolsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);
        localStorage.removeItem('KisRequestExist');
    }

}
