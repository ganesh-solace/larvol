import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './../../core/service/login/login.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

    resetForm: FormGroup;
    errorMsg = '';

    constructor(
        private formBuilder: FormBuilder,
        private loginService: LoginService,
        private router: Router) {
        this.resetForm = this.formBuilder.group({
            email: [
                '',
                [
                    Validators.required,
                    Validators.email,
                ]
            ],
        });
    }

    ngOnInit() {
    }

    /**
     * Send Forgot password link on given email address
     */
    forgotPassword() {
        if (this.resetForm.valid) {
            this.loginService.forgotPassword(this.resetForm.value)
            .then(res => {
                if (res['success']) {
                    this.router.navigate(['/auth/reset-password-link']);
                } else {
                    this.errorMsg = res['message'];
                }
            }).catch(err => {
                console.log(err);
                this.errorMsg = 'Something went wrong. Please try again later';
            });
        } else {
            (<any>Object).values(this.resetForm.controls).forEach(control => {
                control.markAsTouched();
            });
            return;
        }
    }

}
