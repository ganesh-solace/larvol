import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilService } from './../../../core/service/util.service';
import { Router } from '@angular/router';
import { MessageService } from './../../../core/service/message/message.service';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { KolsService } from './../../../core/service/kols/kols.service';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-kol-request',
    templateUrl: './kol-request.component.html',
    styleUrls: ['./kol-request.component.scss']
})
export class KolRequestComponent implements OnInit, OnDestroy {

    previousUrl: string;
    headerTitle = '';
    requestForm: FormGroup;

    constructor(
        private utilService: UtilService,
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private kolsService: KolsService,
        private location: Location,
        private router: Router) {
        if (this.headerTitle === '') {
            this.headerTitle = localStorage.getItem('header_title');
        }
        localStorage.setItem('header_title', 'KOL Request');
        this.messageService.setKolsData('KOL Request');

        this.createForm();
    }

    ngOnInit() {
        // document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.previousUrl = this.utilService.previousUrl;
        console.log(this.headerTitle);
    }

    ngOnDestroy() {
        this.messageService.setKolsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);
    }

    /**
     * Create KOL Request form structure with require validations
     */
    private createForm() {
        this.requestForm = this.formBuilder.group({
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            affiliation: [''],
            specialization: [''],
            city: [''],
            country: [''],
            other: [''],
        });
    }

    /**
     * Submit KOL Request data on server by user
     */
    submitKolRequest() {
        this.messageService.setHttpLoaderStatus(true);
        if (this.requestForm.valid) {
            this.kolsService.submitKOLRequset(this.requestForm.value)
            .then(res => {
                console.log(res);
                if (res['success']) {
                    localStorage.setItem('KisKOLRequest', 'true');
                    this.router.navigate([`${environment.appPrefix}/kol-request-submission`]);
                } else {
                    this.utilService.showError('Error', res['message']);
                }
            }).catch(err => {
                console.log(err);
                this.utilService.showError('Error', err['message']);
            });
        } else {
            (<any>Object).values(this.requestForm.controls).forEach(control => {
                control.markAsTouched();
            });
            return;
        }
    }

    /**
     * Go back on all search result screen
     */
    cancelClick() {
        this.location.back();
    }
}
