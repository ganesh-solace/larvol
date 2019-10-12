import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { CoreAuthComponent } from './core-auth.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ResetSuccessfullyComponent } from './reset-successfully/reset-successfully.component';

const routes: Routes = [{
    path: '',
    component: CoreAuthComponent,
    children: [
        {
            path: 'forgot-password',
            component: ForgotPasswordComponent,
        },
        {
            path: 'reset-password-link',
            component: PasswordResetComponent,
        },
        {
            path: 'reset-successfully',
            component: ResetSuccessfullyComponent,
        },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CoreAuthRoutingModule {
}
