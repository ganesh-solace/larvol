import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from './../../core/service/login/login.service';
import { CustomValidators } from 'ng2-validation';

const newPassword = new FormControl(null, Validators.compose([
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(30)
]));

const confirmPassword = new FormControl(null, {validators: Validators.compose([
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(30),
    CustomValidators.equalTo(newPassword)])
});

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

    resetForm: FormGroup;
    errorMsg = '';
    token = '';
    passwordType1 = 'password';
    passwordType2 = 'password';

    constructor(
        private formBuilder: FormBuilder,
        private loginService: LoginService,
        private router: Router,
        private activatedRoute: ActivatedRoute) {

        this.resetForm = this.formBuilder.group({
            password: newPassword,
            confirm_password: confirmPassword,
        });

        this.activatedRoute.queryParams.subscribe(data => {
            if (data.hasOwnProperty('token')) {
                this.token = data.token;
            } else {
                this.router.navigate(['/login']);
            }
        });
    }

    ngOnInit() {
    }

     /**
     * Call reset password API with new password pass as data
     */
    resetPassword() {
        if (this.resetForm.valid) {
            const postObj = {
                'password': this.resetForm.value.password,
                'password_confirmation': this.resetForm.value.confirm_password,
                'token': this.token,
            };

            this.loginService.resetPassword(postObj)
            .then(res => {
                if (res['success']) {
                    this.router.navigate(['/auth/reset-successfully']);
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

    /**
     * hide/show password data
     */
    hideShowPassword(flag: any) {
        if (flag) {
            if (this.passwordType1 === 'password') {
                this.passwordType1 = 'text';
            } else {
                this.passwordType1 = 'password';
            }
        } else {
            if (this.passwordType2 === 'password') {
                this.passwordType2 = 'text';
            } else {
                this.passwordType2 = 'password';
            }
        }
    }

}
