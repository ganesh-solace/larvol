import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { CoreAuthComponent } from './core-auth.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetSuccessfullyComponent } from './reset-successfully/reset-successfully.component';
import { SignupSuccessfullyComponent } from './signup-successfully/signup-successfully.component';
import { RouterModule } from '@angular/router';
import { CoreAuthRoutingModule } from './core-auth.routing.module';
import { CustomFormsModule } from 'ng2-validation';
import { ToasterModule } from 'angular2-toaster';

@NgModule({
    imports: [
        CommonModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        CoreAuthRoutingModule,
        CustomFormsModule,
        ToasterModule
    ],
    declarations: [
        LoginComponent,
        HeaderComponent,
        CoreAuthComponent,
        ForgotPasswordComponent,
        PasswordResetComponent,
        ResetPasswordComponent,
        ResetSuccessfullyComponent,
        SignupSuccessfullyComponent
    ]
})
export class CoreAuthModule { }
