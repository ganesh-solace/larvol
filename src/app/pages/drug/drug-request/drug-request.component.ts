import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from './../../../core/service/message/message.service';
import { Location } from '@angular/common';
import { DrugsService } from './../../../core/service/drugs/drugs.service';
import { UtilService } from './../../../core/service/util.service';
import { environment } from './../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
    selector: 'app-drug-request',
    templateUrl: './drug-request.component.html',
    styleUrls: ['./drug-request.component.scss']
})
export class DrugRequestComponent implements OnInit, OnDestroy {

    requestForm: FormGroup;
    headerTitle = '';

    constructor(
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private location: Location,
        private drugsService: DrugsService,
        private utilService: UtilService,
        private router: Router
    ) {
        if (this.headerTitle === '') {
            this.headerTitle = localStorage.getItem('header_title');
        }
        localStorage.setItem('header_title', 'Drug Request');
        this.messageService.setKolsData('Drug Request');

        this.createForm();
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.messageService.setKolsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);
    }

    /**
     * Create Drug Request form structure with require validations
     */
    private createForm() {
        this.requestForm = this.formBuilder.group({
            drug_name: ['', [Validators.required]],
            moa: [''],
            company: [''],
            additional_information: [''],
        });
    }

    /**
     * Go back on all search result screen
     */
    cancelClick() {
        this.location.back();
    }

    /**
     * Submit Drug Request data on server by user
     */
    submitDrugRequest() {
        this.messageService.setHttpLoaderStatus(true);
        if (this.requestForm.valid) {
            this.drugsService.submitDrugRequest(this.requestForm.value)
                .then(res => {
                    console.log(res);
                    if (res['success']) {
                        localStorage.setItem('KisDrugRequest', 'true');
                        this.router.navigate([`${environment.appPrefix}/drug-request-submission`]);
                    } else {
                        this.utilService.showError('Error', res['message']);
                    }
                }).catch(err => {
                    console.log(err);
                    this.utilService.showError('Error', err['message']);
                });
        } else {
            (<any>Object).values(this.requestForm.controls).forEach((control: any) => {
                control.markAsTouched();
            });
            return;
        }
    }

    /**
    * Redirect the user to Drug Landing page
    */
    redirectOnLandingPage() {
        localStorage.setItem('selectedEntity', 'drug');
        this.router.navigate(['/home']);
    }

}
