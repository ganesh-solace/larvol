import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Import all required module
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { PagesRoutingModule } from './pages-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ToasterModule } from 'angular2-toaster';
import { JwSocialButtonsModule } from 'jw-angular-social-buttons';
import { DataTableModule } from 'angular7-data-table';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FlexLayoutModule } from '@angular/flex-layout';

// Import all components
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { KolEntityComponent } from './kol/kol-entity/kol-entity.component';
import { KolsLikesListComponent } from './common/kols-likes-list/kols-likes-list.component';
import { WriteNotesComponent } from './common/write-notes/write-notes.component';
import { NotesListComponent } from './common/notes-list/notes-list.component';
import { SaveNoteModalComponent } from './kol/save-note-modal/save-note-modal.component';
import { NotificationComponent } from './common/notification/notification.component';
import { CounterRequestComponent } from './kol/counter-request/counter-request.component';
import { RequestSuccessComponent } from './kol/request-success/request-success.component';
import { ShareModalComponent } from './common/share-modal/share-modal.component';
import { KolsStarViewComponent } from './kol/kols-star-view/kols-star-view.component';
import { KolsSearchListComponent } from './kol/kols-search-list/kols-search-list.component';
import { KolRequestComponent } from './kol/kol-request/kol-request.component';
import { KolRequestSubmissionComponent } from './kol/kol-request-submission/kol-request-submission.component';
import { TermsOfServiceComponent } from './common/terms-of-service/terms-of-service.component';
import { SearchResultListComponent } from './kol/search-result-list/search-result-list.component';
import { PrivacyPolicyComponent } from './common/privacy-policy/privacy-policy.component';
import { CookiePolicyComponent } from './common/cookie-policy/cookie-policy.component';
import { FeedbackComponent } from './common/feedback/feedback.component';
import { SignOutModalComponent } from './common/sign-out-modal/sign-out-modal.component';
import { KolTrialRelatedNewsComponent } from './kol/kol-trial-related-news/kol-trial-related-news.component';
import { BookmarkKolsComponent } from './kol/bookmark-kols/bookmark-kols.component';
import { KolAdvanceSearchComponent } from './kol/kol-advance-search/kol-advance-search.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { HomeComponent } from './home/home.component';
import { HomeHeaderComponent } from './home/home-header/home-header.component';
import { HomeFooterComponent } from './home/home-footer/home-footer.component';
import { ViewPolicyComponent } from './common/view-policy/view-policy.component';
import { MySubscriptionsListComponent } from './common/my-subscriptions-list/my-subscriptions-list.component';
import { MessageModelComponent } from './common/message-model/message-model.component';
import { MySubscriptionsDetailComponent } from './kol/my-subscriptions-detail/my-subscriptions-detail.component';
import { PremiumKolPopupComponent } from './kol/premium-kol-popup/premium-kol-popup.component';
import { PremiumCounterPopupComponent } from './kol/premium-counter-popup/premium-counter-popup.component';
import { KolEntityImageComponent } from './common/kol-entity-image/kol-entity-image.component';
import { TeamNameExistPopupComponent } from './kol/team-name-exist-popup/team-name-exist-popup.component';
import { GroupDeletePopupComponent } from './kol/group-delete-popup/group-delete-popup.component';
import { GroupExistModalComponent } from './kol/group-exist-modal/group-exist-modal.component';
import { DrugLandingPageComponent } from './drug/drug-landing-page/drug-landing-page.component';
import { DrugEntityPageComponent } from './drug/drug-entity-page/drug-entity-page.component';
import { DrugTrialRelatedNewsComponent } from './drug/drug-trial-related-news/drug-trial-related-news.component';
import { DrugStarViewComponent } from './drug/drug-star-view/drug-star-view.component';
import { NewsSocialFeaturesComponent } from './common/news-social-features/news-social-features.component';
import { NotesUpdatePopupComponent } from './notes-update-popup/notes-update-popup.component';
import { NotesDeletePopupComponent } from './notes-delete-popup/notes-delete-popup.component';
import { DrugNotesComponent } from './drug/drug-notes/drug-notes.component';
import { DrugSearchListComponent } from './drug/drug-search-list/drug-search-list.component';
import { DrugSearchResultListComponent } from './drug/drug-search-result-list/drug-search-result-list.component';
import { DrugRequestComponent } from './drug/drug-request/drug-request.component';
import { DrugRequestSubmissionComponent } from './drug/drug-request-submission/drug-request-submission.component';
import { DrugSubscriptionDetailComponent } from './drug/drug-subscription-detail/drug-subscription-detail.component';

// Import Pipes
import { TimeAgoPipe } from './../core/pipes/time-ago.pipe';
import { TrimstrPipe } from './../core/pipes/trimstr/trimstr.pipe';
import { ReversePipe } from './../core/pipes/reverse/reverse.pipe';
import { SafeHtmlPipe } from './../core/pipes/safeHtml/safe-html.pipe';
import { DateFormatPipe } from './../core/pipes/dateFormat/date-format.pipe';

// Import Directive
import { AutoFocusDirective } from './../core/directive/autoFocus/auto-focus.directive';
import { ConferenceDetailComponent } from './kol/conference-detail/conference-detail.component';
import { KolAnalyticsComponent } from './kol/kol-analytics/kol-analytics.component';
import { DrugAttributeComponent } from './drug/drug-attribute/drug-attribute.component';

const PAGES_COMPONENTS = [
    PagesComponent,
    DashboardComponent,
    HeaderComponent,
    KolEntityComponent,
    KolsLikesListComponent,
    SaveNoteModalComponent,
    ShareModalComponent,
    NotificationComponent,
    CounterRequestComponent,
    KolsStarViewComponent,
    KolsSearchListComponent,
    RequestSuccessComponent,
    KolRequestComponent,
    KolRequestSubmissionComponent,
    TermsOfServiceComponent,
    SearchResultListComponent,
    WriteNotesComponent,
    NotesListComponent,
    PrivacyPolicyComponent,
    CookiePolicyComponent,
    FeedbackComponent,
    SignOutModalComponent,
    KolTrialRelatedNewsComponent,
    BookmarkKolsComponent,
    KolAdvanceSearchComponent,
    BreadcrumbsComponent,
    HomeComponent,
    HomeHeaderComponent,
    HomeFooterComponent,
    ViewPolicyComponent,
    MessageModelComponent,
    ViewPolicyComponent,
    MySubscriptionsListComponent,
    KolEntityImageComponent,
    MySubscriptionsDetailComponent,
    PremiumKolPopupComponent,
    PremiumCounterPopupComponent,
    GroupDeletePopupComponent,
    GroupExistModalComponent,
    DrugLandingPageComponent,
    DrugEntityPageComponent,
    DrugTrialRelatedNewsComponent,
    TeamNameExistPopupComponent,
    DrugStarViewComponent,
    NewsSocialFeaturesComponent,
    NotesUpdatePopupComponent,
    NotesDeletePopupComponent,
    DrugNotesComponent,
    DrugSearchListComponent,
    DrugSearchResultListComponent,
    DrugRequestComponent,
    DrugRequestSubmissionComponent,
    DrugSubscriptionDetailComponent,
];

const PIPES = [
    TimeAgoPipe,
    TrimstrPipe,
    ReversePipe,
    SafeHtmlPipe,
    DateFormatPipe
];

const DIRECTIVES = [
    AutoFocusDirective
];

@NgModule({
    imports: [
        CommonModule,
        PagesRoutingModule,
        ScrollingModule,
        MatTabsModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        InfiniteScrollModule,
        ToasterModule,
        JwSocialButtonsModule,
        SlickCarouselModule,
        DataTableModule,
        FlexLayoutModule
    ],
    declarations: [
        ...PAGES_COMPONENTS,
        ...PIPES,
        ...DIRECTIVES,
        ConferenceDetailComponent,
        KolAnalyticsComponent,
        DrugAttributeComponent,
    ],
    entryComponents: [
        HeaderComponent,
        KolsLikesListComponent,
        SaveNoteModalComponent,
        KolsSearchListComponent,
        ShareModalComponent,
        SignOutModalComponent,
        BreadcrumbsComponent,
        HomeHeaderComponent,
        HomeFooterComponent,
        MessageModelComponent,
        PremiumKolPopupComponent,
        PremiumCounterPopupComponent,
        KolEntityImageComponent,
        GroupDeletePopupComponent,
        GroupExistModalComponent,
        TeamNameExistPopupComponent,
        NotesUpdatePopupComponent,
        NotesDeletePopupComponent,
        DrugLandingPageComponent,
        TeamNameExistPopupComponent,
        DrugStarViewComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { }
