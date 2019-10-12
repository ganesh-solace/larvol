import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilService } from './../../../core/service/util.service';
import { MessageService } from './../../../core/service/message/message.service';
import { UserService } from './../../../core/service/user/user.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

    previousUrl: string;
    headerTitle = '';
    notificationList: any = [];
    currentPage = 1;
    nextPage = false;
    isPageLoad: boolean;

    constructor(
        private utilService: UtilService,
        private messageService: MessageService,
        private userService: UserService,
        private router: Router,
        private location: Location) {
        if (this.headerTitle === '') {
            this.headerTitle = localStorage.getItem('header_title');
        }
        localStorage.setItem('header_title', 'Notifications');
        this.messageService.setKolsData('Notifications');
    }

    ngOnInit() {
       this.isPageLoad = false;
       this.previousUrl = this.utilService.previousUrl;
       this.getAllNotifications();
    }

    ngOnDestroy() {
        this.messageService.setKolsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);
    }

    goBack() {
        this.location.back();
    }

    /**
     * get all notification data for registered paid user
     */
    getAllNotifications() {
        const postObj = {
            'page': this.currentPage
        };
        this.userService.getNotifications(postObj)
        .then(res => {
            console.log(res);
            if (res['success']) {
                this.nextPage = res['data']['next_page'];
                if (this.nextPage) {
                    this.currentPage += 1;
                }

                for (const x of Object.keys(res['data']['data'])) {
                    this.notificationList.push(res['data']['data'][x]);
                }

                if (this.notificationList.length === 0) {
                    this.isPageLoad = true;
                }
            }
        }).catch(err => {
            console.log(err);
        });
    }

    /**
     * Load more data when user scroll in tabs
     * @param event
     */
    onScroll(event: any) {
        console.log(event);
        // if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            if (this.nextPage) {
                this.messageService.setHttpLoaderStatus(false);
                this.getAllNotifications();
            }
        // }
    }

    /**
     * Open KOL entity page that contain corresponding comment
     * @param item
     */
    openNewsPage(item: any) {
        console.log(item);
        if ((item['kol_id'] !== null && item['kol_id'] > 0) || (item['trial_id'] !== null && item['trial_id'] > 0) || (item['product_id'] !== null && item['product_id'] > 0)) {
            const data = item['news_item'];
            data['kol_id'] = item['kol_id'];
            data['activity_type'] = item['activity_type'];
            data['is_for_kol'] = item['is_for_kol'];
            data['trial_id'] = item['trial_id'];
            data['product_id'] = item['product_id'];
            data['conference_id'] = item['conference_id'];
            if (data['is_for_kol'] === 1) {
                localStorage.setItem('knews_item', JSON.stringify(data));
                if (item['kol_id'] > 0) {
                    this.router.navigate([`${environment.appPrefix}/kol-entity/${btoa(<any>item['kol_id'])}`]);
                } else {
                    this.router.navigate([`${environment.appPrefix}/drug-entity/${btoa(<any>item['product_id'])}`]);
                }
            } else if (data.trial_id > 0) {
                data['is_notification'] = true;
                localStorage.setItem('ktrials_data', JSON.stringify(data));
                localStorage.setItem('knews_item', JSON.stringify(data));
                if (item['kol_id'] > 0) {
                    this.router.navigate([`${environment.appPrefix}/kol-trial-related-news`]);
                } else {
                    this.router.navigate([`${environment.appPrefix}/drug-trial-related-news`]);
                }
            } else if (data.conference_id > 0) {
              data['is_notification'] = true;
              localStorage.setItem('kconference_data', JSON.stringify(data));
              localStorage.setItem('knews_item', JSON.stringify(data));
              this.router.navigate([`${environment.appPrefix}/conference-detail`]);
            }
        }
    }

    getNameInitials(item: any) {
        let name = '';
        if (item.first_name !== null) {
            name = `${item.first_name.split(' ')[0][0]}`;
        }
        if (item.last_name !== null) {
            name = name + `${item.last_name.split(' ')[0][0]}`;
        }
        return name;
    }
}
