import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { KolEntityComponent } from './kol/kol-entity/kol-entity.component';
import { WriteNotesComponent } from './common/write-notes/write-notes.component';
import { NotesListComponent } from './common/notes-list/notes-list.component';
import { NotificationComponent } from './common/notification/notification.component';
import { CounterRequestComponent } from './kol/counter-request/counter-request.component';
import { RequestSuccessComponent } from './kol/request-success/request-success.component';
import { KolRequestComponent } from './kol/kol-request/kol-request.component';
import { KolRequestSubmissionComponent } from './kol/kol-request-submission/kol-request-submission.component';
import { SearchResultListComponent } from './kol/search-result-list/search-result-list.component';
import { CookiePolicyComponent } from './common/cookie-policy/cookie-policy.component';
import { FeedbackComponent } from './common/feedback/feedback.component';
import { KolTrialRelatedNewsComponent } from './kol/kol-trial-related-news/kol-trial-related-news.component';
import { BookmarkKolsComponent } from './kol/bookmark-kols/bookmark-kols.component';
import { KolAdvanceSearchComponent } from './kol/kol-advance-search/kol-advance-search.component';
import { MySubscriptionsListComponent } from './common/my-subscriptions-list/my-subscriptions-list.component';
import { MySubscriptionsDetailComponent } from './kol/my-subscriptions-detail/my-subscriptions-detail.component';
import { DrugEntityPageComponent } from './drug/drug-entity-page/drug-entity-page.component';
import { DrugTrialRelatedNewsComponent } from './drug/drug-trial-related-news/drug-trial-related-news.component';
import { DrugNotesComponent } from './drug/drug-notes/drug-notes.component';
import { DrugSearchResultListComponent } from './drug/drug-search-result-list/drug-search-result-list.component';
import { DrugRequestComponent } from './drug/drug-request/drug-request.component';
import { DrugRequestSubmissionComponent } from './drug/drug-request-submission/drug-request-submission.component';
import { DrugSubscriptionDetailComponent } from './drug/drug-subscription-detail/drug-subscription-detail.component'
import { ConferenceDetailComponent } from './kol/conference-detail/conference-detail.component';

import { DrugAttributeComponent } from './drug/drug-attribute/drug-attribute.component';

const routes: Routes = [{
    path: '',
    component: PagesComponent,
    children: [
        {
            path: '',
            component: DashboardComponent,
            data: {
                breadcrumb: 'Home'
            }
        },
        {
            path: 'kol-entity/:id',
            component: KolEntityComponent,
            data: {
                breadcrumb: 'Detail'
            }
        },
        {
            path: 'write-notes/:kol_id/:id',
            component: WriteNotesComponent,
        },
        {
            path: 'notes-list',
            component: NotesListComponent,
        },
        {
            path: 'notification',
            component: NotificationComponent,
        },
        {
            path: 'counter-request',
            component: CounterRequestComponent,
        },
        {
            path: 'request-success',
            component: RequestSuccessComponent,
        },
        {
            path: 'kol-request',
            component: KolRequestComponent,
        },
        {
            path: 'kol-request-submission',
            component: KolRequestSubmissionComponent,
        },
        {
            path: 'kols-list',
            component: SearchResultListComponent,
        },
        {
            path: 'cookie-policy',
            component: CookiePolicyComponent,
        },
        {
            path: 'feedback',
            component: FeedbackComponent,
        },
        {
            path: 'kol-trial-related-news',
            component: KolTrialRelatedNewsComponent,
        },
        {
            path: 'bookmark-news',
            component: BookmarkKolsComponent,
        },
        {
            path: 'advance-search',
            component: KolAdvanceSearchComponent
        },
        {
            path: 'subscription-list',
            component: MySubscriptionsListComponent
        },
        {
            path: 'subscription-detail',
            component: MySubscriptionsDetailComponent
        },
        {
            path: 'drug-entity/:id',
            // path: 'drug-entity',
            component: DrugEntityPageComponent
        },
        {
            path: 'drug-trial-related-news',
            component: DrugTrialRelatedNewsComponent
        },
        {
            path: 'drug-notes',
            component: DrugNotesComponent
        },
        {
            path: 'drug-search-result',
            component: DrugSearchResultListComponent
        },
        {
            path: 'drug-request',
            component: DrugRequestComponent
        },
        {
            path: 'drug-request-submission',
            component: DrugRequestSubmissionComponent
        },
        {
            path: 'drug-subscription-detail',
            component: DrugSubscriptionDetailComponent
        },
        {
            path : 'conference-detail',
            component: ConferenceDetailComponent
        },
        {
            path: 'drug-attribute',
            component: DrugAttributeComponent
        }
    ],
    runGuardsAndResolvers: 'always',
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
