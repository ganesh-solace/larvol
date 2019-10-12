import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilService } from './../../../core/service/util.service';
import { Router } from '@angular/router';
import { MessageService } from './../../../core/service/message/message.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { KolsService } from './../../../core/service/kols/kols.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-counter-request',
    templateUrl: './counter-request.component.html',
    styleUrls: ['./counter-request.component.scss']
})
export class CounterRequestComponent implements OnInit, OnDestroy {

    previousUrl: string;
    headerTitle = '';
    counterRequestForm: FormGroup;
    // tslint:disable-next-line:max-line-length
    emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    constructor(
        private utilService: UtilService,
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private kolsService: KolsService,
        private router: Router) {
        if (this.headerTitle === '') {
            this.headerTitle = localStorage.getItem('header_title');
        }
        localStorage.setItem('header_title', 'Contact Sales Team');
        this.messageService.setKolsData('Contact Sales Team');
        this.createForm();
    }

    ngOnInit() {
        this.previousUrl = this.utilService.previousUrl;
    }

    ngOnDestroy() {
        this.messageService.setKolsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);
    }

    private createForm() {
        this.counterRequestForm = this.formBuilder.group({
            first_name: ['', [Validators.required]],
            last_name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            phone_no: ['', [Validators.required, Validators.maxLength(10)]]
        });
    }

    /**
     * on submit counter request form
     */
    onSubmit() {
        if (this.counterRequestForm.valid) {
            this.kolsService.submitCounterRequest(this.counterRequestForm.value)
            .then(res => {
                if (res['success']) {
                    localStorage.setItem('KisRequestExist', 'true');
                    this.router.navigate([`${environment.appPrefix}/request-success`]);
                } else {
                    this.utilService.showError('Error', res['message']);
                }
            }).catch(err => {
                this.utilService.showError('Error', err.message);
            });
        } else {
            (<any>Object).values(this.counterRequestForm.controls).forEach(control => {
                control.markAsTouched();
            });
            return;
        }
    }

    /**
     * Accept only number in phone number field
     * @param event
     */
    public numberOnly(event: any): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          return false;
        }
        return true;
    }
}
