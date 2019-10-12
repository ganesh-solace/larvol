import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilService } from './../../../core/service/util.service';
import { Router } from '@angular/router';
import { MessageService } from './../../../core/service/message/message.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-drug',
    templateUrl: './drug-request-submission.component.html',
    styleUrls: ['./drug-request-submission.component.scss']
})
export class DrugRequestSubmissionComponent implements OnInit, OnDestroy {

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
        localStorage.setItem('header_title', 'Drug Request');
        this.messageService.setKolsData('Drug Request');
        if (localStorage.getItem('KisDrugRequest') === null || localStorage.getItem('KisDrugRequest') === undefined) {
            this.router.navigate(['']);
        }
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.messageService.setKolsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);
        localStorage.removeItem('KisDrugRequest');
    }

    /**
     * Go back to home page
     */
    gotoHome() {
        localStorage.setItem('selectedEntity', 'drug');
        this.router.navigate(['/home']);
    }

    goBack() {
        this.location.back();
    }

}
