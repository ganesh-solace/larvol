import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './core/auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { AnonymousGuardService } from './core/auth/anonymous-guard.service';
import { ResetPasswordComponent } from './auth//reset-password/reset-password.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { TermsOfServiceComponent } from './pages/common/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './pages/common/privacy-policy/privacy-policy.component';
import { SignupSuccessfullyComponent } from './auth/signup-successfully/signup-successfully.component';
import { HomeComponent } from './pages/home/home.component';
import { environment } from '../environments/environment';
import { ViewPolicyComponent } from './pages/common/view-policy/view-policy.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AnonymousGuardService],
        component: HomeComponent
    },
    {
        path: 'home',
        canActivate: [AuthGuard],
        loadChildren: './pages/pages.module#PagesModule',
    },
    {
        path: 'login',
        canActivate: [AnonymousGuardService],
        component: LoginComponent,
    },
    {
        path: 'signup',
        canActivate: [AnonymousGuardService],
        component: SignUpComponent,
    },
    {
        path: 'password/reset',
        canActivate: [AnonymousGuardService],
        component: ResetPasswordComponent,
    },
    {
        path: 'auth',
        canActivate: [AnonymousGuardService],
        loadChildren: './auth/core-auth.module#CoreAuthModule',
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
    },
    {
        path: 'terms-of-service',
        component: TermsOfServiceComponent,
    },
    {
        path: 'signup-success',
        // canActivate: [AnonymousGuardService],
        component: SignupSuccessfullyComponent
    },
    {
        path: 'view-policy',
        component: ViewPolicyComponent
    },
    { path: '', redirectTo: `${environment.appPrefix}`, pathMatch: 'full' },
    { path: '**', redirectTo: `${environment.appPrefix}` },
];

const config: ExtraOptions = {
    useHash: false,
    onSameUrlNavigation: 'reload'
};

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
