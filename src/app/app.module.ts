import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap, ApplicationRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { FooterComponent } from './auth/footer/footer.component';

// Import HTTP models (used for calling API in server)
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgHttpLoaderModule } from 'ng-http-loader';

// Import Routing model
import { AppRoutingModule } from './app-routing.module';

import { AuthGuard } from './core/auth/auth.guard';
import { AnonymousGuardService } from './core/auth/anonymous-guard.service';

// Import models
import { CoreAuthModule} from './auth/core-auth.module';
import { PagesModule } from './pages/pages.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LarvolHttpInterceptor } from './http-interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { JwSocialButtonsModule } from 'jw-angular-social-buttons';

import { ToasterModule } from 'angular2-toaster';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { MatInputModule } from '@angular/material/input';
import { ToastrModule } from 'ng6-toastr-notifications';

// import { RecaptchaModule } from 'angular-google-recaptcha';
import { RecaptchaModule } from 'ng-recaptcha';
import { CookieService } from 'ngx-cookie-service';

import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { DataTableModule } from 'angular7-data-table';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
        SignUpComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        CoreAuthModule,
        PagesModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        AngularFontAwesomeModule,
        BrowserAnimationsModule,
        NgHttpLoaderModule,
        ToasterModule.forRoot(),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        JwSocialButtonsModule,
        MatInputModule,
        // RecaptchaModule.forRoot({
        //     siteKey: '6LdD64gUAAAAAA2j1DVXp60KSuqPkb-ggK4GxWQs',
        // }),
        RecaptchaModule,
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AngularFireMessagingModule,
        AngularFireModule.initializeApp(environment.firebase),
        ToastrModule.forRoot(),
        SlickCarouselModule,
        DataTableModule.forRoot(),
        FlexLayoutModule
    ],
    entryComponents: [AppComponent],
    providers: [
        AuthGuard,
        AnonymousGuardService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LarvolHttpInterceptor,
            multi: true
        },
        { provide: APP_BASE_HREF, useValue: '/' },
        CookieService
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule implements DoBootstrap {
    ngDoBootstrap(appRef: ApplicationRef) {
        appRef.bootstrap(AppComponent);
    }
}
