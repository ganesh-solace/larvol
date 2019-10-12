import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { LoginService } from './../../core/service/login/login.service';
import { UtilService } from './../../core/service/util.service';

const newPassword = new FormControl('', Validators.compose([
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(30)
]));

const confirmPassword = new FormControl('', {
    validators: Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        CustomValidators.equalTo(newPassword)])
});

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

    signupForm: FormGroup;
    isFormSubmit = false;
    errorMsg: any = '';
    emailError = false;
    existEmail = '';
    // tslint:disable-next-line:max-line-length
    emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    constructor(
        private router: Router,
        private loginService: LoginService,
        private utilService: UtilService,
        private formBuilder: FormBuilder,
    ) {
        this.createForm();
    }

    ngOnInit() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.signupForm.reset();
        (<any>Object).values(this.signupForm.controls).forEach((control: any) => {
            control.markAsUntouched();
        });
    }

    /**
     * Go back on login page
     */
    goOnLoginPage() {
        this.router.navigate(['/login']);
    }

    /**
     * Create signup form structure with require validations
     */
    private createForm() {
        this.signupForm = this.formBuilder.group({
            first_name: [
                '',
                [
                    Validators.required,
                ]
            ],
            last_name: [
                '',
                [
                    Validators.required,
                ]
            ],
            company: [''],
            email: ['', [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]],
            password: newPassword,
            confirm_password: confirmPassword,
            isCheck: ['', [Validators.required]],
            recaptcha: ['', [Validators.required]]
        });
    }

    resolved(event: any) {
        this.signupForm.controls.recaptcha.setValue(event);
    }

    /**
    * Check require data for signup and calling api for same
    */
    doSignup() {
        this.isFormSubmit = true;
        this.emailError = false;
        if (this.signupForm.valid && this.signupForm.value.isCheck) {
            this.loginService.signup(this.signupForm.value)
                .then(signupRes => {
                    if (signupRes['success']) {
                        this.utilService.setToken(signupRes['data']['api_token']);
                        this.utilService.setLoggedUserData(JSON.stringify(signupRes['data']['user']));
                        this.router.navigate(['/signup-success']);
                    } else {
                        if (signupRes['errors']['email']) {
                            this.emailError = true;
                        }
                        this.errorMsg = signupRes['message'];
                    }
                }).catch(err => {
                    this.utilService.showError('Eroor', 'Something went wrong. Please try again later');
                    this.errorMsg = 'Something went wrong. Please try again later';
                });
        } else {
            if (!this.signupForm.value.isCheck) {
                this.signupForm.controls.isCheck.setValue('');
            }
            (<any>Object).values(this.signupForm.controls).forEach((control: any) => {
                control.markAsTouched();
            });
            return;
        }
    }


    checkEmail() {
        this.emailError = false;
    }

    onScriptLoad() {
        console.log('loaded');
    }
}
