import { Component, OnInit, Renderer2, OnDestroy, ElementRef, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KolsLikesListComponent } from './../../common/kols-likes-list/kols-likes-list.component';
import { Router, ActivatedRoute } from '@angular/router';
import { KolsService } from './../../../core/service/kols/kols.service';
import { MessageService } from './../../../core/service/message/message.service';
import { ShareModalComponent } from './../../common/share-modal/share-modal.component';
import { UtilService } from './../../../core/service/util.service';
import { environment } from '../../../../environments/environment';
import { KolEntityImageComponent } from './../../common/kol-entity-image/kol-entity-image.component';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { ConferenceService } from 'src/app/core/service/conference/conference.service';
import { GoogleAnalyticsService } from 'src/app/core/service/google-analytics.service';
import { EventsData } from 'src/app/core/service/gaEventsData';

declare var $: any;

@Component({
    selector: 'app-kol-entity',
    templateUrl: './kol-entity.component.html',
    styleUrls: ['./kol-entity.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KolEntityComponent implements OnInit, OnDestroy {

    @ViewChild('kolInfo') kolinfo: ElementRef;
    shouldShow1: Boolean = false;
    KOLsData: any;
    KOLsId: any;
    newsData: any = [];
    eventsData: any = [];
    twittersData: any = [];
    trialsData: any = [];
    newsType = 'news';
    newsSettingsData: any;
    eventsSettingsData: any;
    twittersSettingsData: any;
    trialsSettingsData: any;
    currentPage = 1;
    nextPage = false;
    usersData: any;
    writeNoteUrl = `${environment.appPrefix}/write-notes/${this.KOLsId}/${btoa(<any>0)}`;
    infoSectionHeight = '100px';
    newsId = 0;
    notificationData: any;
    lastView: any = '';
    isNewsLoad = false;
    isEventLoad = false;
    isTweetsLoad = false;
    isTrailsLoad = false;
    selectedTab = 0;
    isAPIRun = false;
    isPageLoad: boolean;
    isNewsPageLoad = false;
    isLAPP = false;
    isFShow = false;
    userList: any = [];
    isNextUserPage = false;
    userCurrentPage = 1;
    allUserList: any = [];
    existingUserList: any = [];
    isNewsLoadCount = 0;
    selectedUserName: any = [];
    keyData = null;
    isShow = false;
    selectedNewItem: any;
    kolListRef: any;
    images: any = [];
    isTweetsShow = true;
    isEventPageLoad = false;
    isTweetPageLoad = false;
    isTrailBack = false;
    isTweetsNotification = false;
    isNewsNotification = false;
    isEventsNotification = false;
    isKolDataChange = false;
    conferenceSettingsData: any;
    conferenceData: any = [];
    isConferenceLoad = false;
    isConferencePageLoad = false;
    isConferenceBack = false;
    isKolStatusChange = false;

    @HostListener('document:click', ['$event'])
    clickout(event: any) {
        if (event.srcElement.className.indexOf('comment') === -1) {
            if (this.isShow) {
                this.isShow = false;
            }
        }
        if (event.srcElement.className.indexOf('mat-tab-label-content') > -1 || event.srcElement.className.indexOf('mat-tab-label-active') > -1) {
            this.clickTab();
        }
    }

    constructor(
        private renderer: Renderer2,
        private modalService: NgbModal,
        private router: Router,
        private kolsService: KolsService,
        private messageService: MessageService,
        private activatedRoute: ActivatedRoute,
        private utilService: UtilService,
        private spinner: SpinnerVisibilityService,
        private conferenceService: ConferenceService,
        private gaService:GoogleAnalyticsService
    ) {
        setTimeout(() => {
            this.infoSectionHeight = this.kolinfo.nativeElement.offsetHeight + 'px';
        }, 500);

        this.activatedRoute.params.subscribe(data => {
            if (data.hasOwnProperty('id')) {
                this.KOLsId = atob(data.id);
            } else {
                this.router.navigate([`${environment.appPrefix}`]);
            }
        });

        this.usersData = this.utilService.getLoggedUserData();

        this.messageService.getKolsListEditStatus().subscribe(res => {
            if (res) {
                this.usersData.favourite_kols_count = this.usersData.favourite_kols_count + 1;
            } else {
                this.usersData.favourite_kols_count = this.usersData.favourite_kols_count - 1;
            }
        });

        this.kolListRef = this.messageService.getLoggedUserData().subscribe(res => {
            this.usersData = this.utilService.getLoggedUserData();
        });

        if (this.usersData !== null || this.usersData !== undefined || this.usersData !== '') {
            if (this.usersData['organizations'].length === 0) {
                this.isLAPP = true;
            }
        }

        if (localStorage.getItem('knews_item') !== null) {
            this.notificationData = <any>JSON.parse(localStorage.getItem('knews_item'));
            this.newsId = this.notificationData['id'];
            if (this.notificationData['news_type'] === 0) {
                this.isNewsNotification = true;
                this.getAllNewsDataByKOLsId('news', 0);
            } else if (this.notificationData['news_type'] === 1) {
                this.isEventsNotification = true;
                this.getAllNewsDataByKOLsId('events', 0);
            } else if (this.notificationData['news_type'] === 2) {
                this.isTweetsNotification = true;
                this.getAllNewsDataByKOLsId('twitter', 0);
            }
            setTimeout(() => {
                localStorage.removeItem('knews_item');
            }, 2000);
        }
        this.writeNoteUrl = `${environment.appPrefix}/write-notes/${btoa(this.KOLsId)}/${btoa(<any>0)}`;
        this.getKolsDetailData();
    }

    ngOnInit() {
        this.messageService.setKolsData({});
        this.isPageLoad = false;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.renderer.removeClass(document.body, 'stickyheader');
        $('.mat-tab-header').removeClass('infoHeight');
        $('.mat-tab-header').css('top', '0px');
        this.messageService.setHttpLoaderStatus(true);

        if (localStorage.getItem('kselected_tab') !== null && localStorage.getItem('kselected_tab') !== undefined) {
            this.selectedTab = <any>localStorage.getItem('kselected_tab');
            this.newsType = '';
            this.isKolStatusChange = false;
            localStorage.removeItem('kselected_tab');
            if (localStorage.getItem('ktrials_data') !== null && localStorage.getItem('ktrials_data') !== undefined) {
                this.isTrailBack = true;
                this.isConferenceBack = false;
                localStorage.removeItem('ktrials_data');
            } else {
                this.isConferenceBack = true;
                this.isTrailBack = false;
                localStorage.removeItem('kconference_data');
            }
        }

        if (localStorage.getItem('knews_item') === null || localStorage.getItem('knews_item') === undefined) {
            if (this.isTrailBack) {
                this.getAllTrialsDataByKOLsId();
            } else if (this.isConferenceBack) {
                this.getAllConferencesDataByKOLsId(0);
            } else {
                this.getAllNewsDataByKOLsId('news', 0);
            }
        }
    }

    ngOnDestroy() {
        this.messageService.setHttpLoaderStatus(true);
        localStorage.removeItem('isRecentSearch');

        if (!!this.kolListRef) {
            this.kolListRef.unsubscribe();
        }

    }

    /**
    * Get KOL detail data by KOL id
    */
    getKolsDetailData() {
        this.kolsService.getKOLsDetailData(this.KOLsId)
            .then(res => {
                if (res['success']) {
                    const instituteData = [];
                    for (const i of Object.keys(res['data']['data']['kol_institutions'])) {
                        const data = [];
                        if (res['data']['data']['kol_institutions'][i]['name'] !== null && res['data']['data']['kol_institutions'][i]['name'] !== '') {
                            data.push(res['data']['data']['kol_institutions'][i]['name']);
                        }
                        if (res['data']['data']['kol_institutions'][i]['city'] !== null && res['data']['data']['kol_institutions'][i]['city'] !== '') {
                            data.push(res['data']['data']['kol_institutions'][i]['city']);
                        }
                        if (res['data']['data']['kol_institutions'][i]['state'] !== null && res['data']['data']['kol_institutions'][i]['state'] !== '') {
                            data.push(res['data']['data']['kol_institutions'][i]['state']);
                        }
                        if (res['data']['data']['kol_institutions'][i]['country'] !== null && res['data']['data']['kol_institutions'][i]['country'] !== '') {
                            data.push(res['data']['data']['kol_institutions'][i]['country']);
                        }
                        instituteData.push(data.join(', '));
                    }
                    res['data']['data']['institutionsData'] = instituteData;
                    this.KOLsData = res['data']['data'];
                    if (this.KOLsData.kol_full_name !== null) {
                        if (this.router.url !== '/home') {
                            localStorage.setItem('header_title', this.KOLsData.kol_full_name);
                            this.messageService.setKolsData(this.KOLsData.kol_full_name);
                        }
                    } else {
                        localStorage.setItem('header_title', '');
                        this.messageService.setKolsData('');
                    }
                    this.isFShow = true;

                    // if (this.isTrailBack) {
                    //     this.getAllTrialsDataByKOLsId();
                    // } else {
                    //     this.getAllNewsDataByKOLsId('news', 0);
                    // }
                    // this.getAllNewsDataByKOLsId('events', 0);
                    // this.getAllNewsDataByKOLsId('twitter', 0);
                    // this.getAllTrialsDataByKOLsId();
                }
            }).catch(err => {
                console.log(err);
                this.isTweetsLoad = false;
                this.isNewsLoad = false;
                this.isEventLoad = false;
                this.isAPIRun = false;
                this.isNewsPageLoad = true;
                this.isPageLoad = true;
                this.isFShow = true;
                this.isEventPageLoad = true;
                this.isTweetPageLoad = true;
            });
    }

    /**
    * Show list of existing comments for news
    */
    hideShowComment(item: any) {
        if (item.isShow) {
            item.isShow = !item.isShow;
        } else {
            this.messageService.setHttpLoaderStatus(true);
            this.getAllExistingComments(item);
        }
        if (item.isShow) {
            this.selectedNewItem = item;
        } else {
            this.selectedNewItem = item;
        }
        item.showUserList = false;
        if (this.selectedTab === 0 || this.selectedTab === null) {
            this.newsData.filter((list: any) => {
                if (list.id !== item.id) {
                    list.isShow = false;
                }
                list.showUserList = false;
            });
        } else if (this.selectedTab === 1) {
            this.eventsData.filter((list: any) => {
                if (list.id !== item.id) {
                    list.isShow = false;
                }
                list.showUserList = false;
            });
        } else if (this.selectedTab === 2) {
            this.twittersData.filter((list: any) => {
                if (list.id !== item.id) {
                    list.isShow = false;
                }
                list.showUserList = false;
            });
        }
    }

    /**
    * Get comment data from server
    * @param item
    */
    getAllExistingComments(item: any) {
        this.kolsService.getAllExistingComments(item.id)
            .then((res: any) => {
                if (res['success']) {
                    item.isShow = !item.isShow;
                    item.settingData = res['data'];
                    item.comments = [];
                    item.commentText = '';
                    for (const x of Object.keys(res['data']['data'])) {
                        item.comments.unshift(res['data']['data'][x]);
                    }
                    item.comment_count = item.comments.length;
                }
            }).catch((err: any) => {
                console.log(err);
            });
    }

    /**
    * Open all Likes list for selected news data
    */
    openLikesList(item: any) {
        if (item.like_count > 0) {
            this.messageService.setHttpLoaderStatus(true);
            this.kolsService.getLikedForNews(item['id'], {})
                .then((res: any) => {
                    if (res['success']) {
                        const activeModal = this.modalService.open(KolsLikesListComponent, { size: 'sm' });
                        activeModal.componentInstance.newsData = item;
                        activeModal.componentInstance.likesAllData = res;
                    }
                }).catch((err: any) => {
                    console.log(err);
                });
        }
    }

    /**
    * Open social share popup
    */
    sharePopup(item: any) {
        console.log(item);
        const activeModal = this.modalService.open(ShareModalComponent, { size: 'sm' });
        activeModal.componentInstance.url = item.url;
        activeModal.componentInstance.title = item.title;
        activeModal.result.then((result) => {
            if (result === 'success') {
                this.messageService.setHttpLoaderStatus(false);
                this.kolsService.increaseShareCOunt(item.id)
                    .then(res => {
                        if (res['success']) {
                            item.shared_count = res['data']['shared_count'];
                            this.messageService.setHttpLoaderStatus(true);
                        }
                    }).catch(err => {
                        console.log(err);
                    });
            }
        }, (reason) => {
            console.log(reason);
        });
    }

    /**
    * Get News/events/twitters data by KOls id
    */
    getAllNewsDataByKOLsId(type, next) {
        const postObj = {
            'type': type,
        };

        if (next > 0) {
            postObj['next'] = next;
        }

        this.kolsService.getAllNewsByKOLsId(this.KOLsId, postObj)
            .then((newsRes: any) => {
                this.isAPIRun = false;
                if (newsRes['success']) {
                    this.isTweetsShow = newsRes['data']['is_excutable'];
                    if (type === 'news') {
                        if (!this.isTrailBack && this.newsId === 0 && !this.isKolDataChange && !this.isConferenceBack && next === 0) {
                            this.callOtherAPIs('news');
                        }
                        if (this.isNewsNotification && next === 0) {
                            this.callOtherAPIs('news');
                        }
                        this.newsSettingsData = newsRes['data'];
                        let data = {};
                        for (const x of Object.keys(newsRes['data']['data'])) {
                            if (next === 0) {
                                this.lastView = newsRes['data']['data'][x]['last_view'];
                            }

                            if (this.isLAPP) {
                                if (this.KOLsData['favourite']) {
                                    if (this.lastView === '' || this.lastView === null) {
                                        newsRes['data']['data'][x]['read_status'] = 0;
                                    } else if (this.lastView < newsRes['data']['data'][x]['created']) {
                                        console.log(this.lastView);
                                        newsRes['data']['data'][x]['read_status'] = 0;
                                    } else {
                                        newsRes['data']['data'][x]['read_status'] = 1;
                                    }
                                } else {
                                    newsRes['data']['data'][x]['read_status'] = 1;
                                }
                            } else {
                                if (localStorage.getItem('isRecentSearch') !== null && localStorage.getItem('isRecentSearch') !== '' && localStorage.getItem('isRecentSearch') !== undefined) {
                                    if (this.KOLsData['favourite']) {
                                        if (this.lastView === '' || this.lastView === null) {
                                            newsRes['data']['data'][x]['read_status'] = 0;
                                        } else if (this.lastView < newsRes['data']['data'][x]['created']) {
                                            newsRes['data']['data'][x]['read_status'] = 0;
                                        } else {
                                            newsRes['data']['data'][x]['read_status'] = 1;
                                        }
                                    } else {
                                        newsRes['data']['data'][x]['read_status'] = 0;
                                    }
                                } else {
                                    if (this.lastView === '' || this.lastView === null) {
                                        newsRes['data']['data'][x]['read_status'] = 0;
                                    } else if (this.lastView < newsRes['data']['data'][x]['created']) {
                                        newsRes['data']['data'][x]['read_status'] = 0;
                                    } else {
                                        newsRes['data']['data'][x]['read_status'] = 1;
                                    }
                                }
                            }
                            newsRes['data']['data'][x]['isShow'] = false;
                            newsRes['data']['data'][x]['target'] = '_blank';
                            if (newsRes['data']['data'][x]['url'] === '') {
                                newsRes['data']['data'][x]['url'] = 'javascript:void(0)';
                                newsRes['data']['data'][x]['target'] = '';
                            } else if (newsRes['data']['data'][x]['url'].indexOf('http') === -1) {
                                newsRes['data']['data'][x]['url'] = 'http://' + newsRes['data']['data'][x]['url'];
                            }
                            this.newsData.push(newsRes['data']['data'][x]);
                            if (newsRes['data']['data'][x]['id'] === this.newsId) {
                                data = newsRes['data']['data'][x];
                            }
                        }
                        // if (this.newsData.length === 0) {
                        console.log('newss');
                        this.isNewsPageLoad = true;
                        // }
                        if (this.newsId > 0 && this.notificationData['news_type'] === 0) {
                            this.selectedTab = 0;
                            const self = this;
                            setTimeout(() => {
                                $(document).ready(function () {
                                    const top = $('#news_' + self.newsId).offset().top;
                                    const kinfo_height = $('#kolInfo').outerHeight();
                                    const tab_height = $('.mat-tab-label-container').outerHeight();
                                    const sc = top - kinfo_height - tab_height - 15;
                                    $('html, body').animate({
                                        scrollTop: sc + 'px'
                                    }, 1800);
                                    if (self.notificationData['activity_type'] === 0) {
                                        setTimeout(() => {
                                            self.openLikesList(data);
                                        }, 2000);
                                    } else {
                                        document.getElementById(<any>self.newsId).click();
                                    }
                                });
                            }, 500);
                        }
                        this.isNewsLoad = false;
                        this.isNewsLoadCount++;
                    } else if (type === 'events') {
                        if (this.isEventsNotification && next === 0) {
                            this.callOtherAPIs('events');
                        }
                        this.eventsSettingsData = newsRes['data'];
                        let data = {};
                        for (const x of Object.keys(newsRes['data']['data'])) {
                            if (next === 0) {
                                this.lastView = newsRes['data']['data'][x]['last_view'];
                            }
                            if (this.isLAPP) {
                                if (this.KOLsData['favourite']) {
                                    if (this.lastView === '' || this.lastView === null) {
                                        newsRes['data']['data'][x]['read_status'] = 0;
                                    } else if (this.lastView < newsRes['data']['data'][x]['created']) {
                                        newsRes['data']['data'][x]['read_status'] = 0;
                                    } else {
                                        newsRes['data']['data'][x]['read_status'] = 1;
                                    }
                                } else {
                                    newsRes['data']['data'][x]['read_status'] = 1;
                                }
                            } else {
                                if (localStorage.getItem('isRecentSearch') !== null && localStorage.getItem('isRecentSearch') !== '' && localStorage.getItem('isRecentSearch') !== undefined) {
                                    if (this.KOLsData['favourite']) {
                                        if (this.lastView === '' || this.lastView === null) {
                                            newsRes['data']['data'][x]['read_status'] = 0;
                                        } else if (this.lastView < newsRes['data']['data'][x]['created']) {
                                            newsRes['data']['data'][x]['read_status'] = 0;
                                        } else {
                                            newsRes['data']['data'][x]['read_status'] = 1;
                                        }
                                    } else {
                                        newsRes['data']['data'][x]['read_status'] = 1;
                                    }
                                } else {
                                    if (this.lastView === '' || this.lastView === null) {
                                        newsRes['data']['data'][x]['read_status'] = 0;
                                    } else if (this.lastView < newsRes['data']['data'][x]['created']) {
                                        newsRes['data']['data'][x]['read_status'] = 0;
                                    } else {
                                        newsRes['data']['data'][x]['read_status'] = 1;
                                    }
                                }
                            }
                            newsRes['data']['data'][x]['target'] = '_blank';
                            if (newsRes['data']['data'][x]['presentation_date'] !== '0000-00-00 00:00:00' && newsRes['data']['data'][x]['presentation_date'] !== null) {
                                // tslint:disable-next-line:max-line-length
                                newsRes['data']['data'][x]['presentation_date'] = newsRes['data']['data'][x]['presentation_date'].replace(/\s/g, 'T');
                            } else {
                                newsRes['data']['data'][x]['presentation_date'] = '';
                            }

                            if (newsRes['data']['data'][x]['presentation_enddate'] !== '0000-00-00 00:00:00' && newsRes['data']['data'][x]['presentation_enddate'] !== null) {
                                // tslint:disable-next-line:max-line-length
                                newsRes['data']['data'][x]['presentation_enddate'] = newsRes['data']['data'][x]['presentation_enddate'].replace(/\s/g, 'T');
                            } else {
                                newsRes['data']['data'][x]['presentation_enddate'] = '';
                            }
                            if (newsRes['data']['data'][x]['url'] === '') {
                                newsRes['data']['data'][x]['url'] = 'javascript:void(0)';
                                newsRes['data']['data'][x]['target'] = '';
                            } else if (newsRes['data']['data'][x]['url'].indexOf('http') === -1) {
                                newsRes['data']['data'][x]['url'] = 'http://' + newsRes['data']['data'][x]['url'];
                            }

                            const location = [];
                            if (newsRes['data']['data'][x]['city'] !== null && newsRes['data']['data'][x]['city'] !== '') {
                              location.push(newsRes['data']['data'][x]['city']);
                            }
                            if (newsRes['data']['data'][x]['state'] !== null && newsRes['data']['data'][x]['state'] !== '') {
                              location.push(newsRes['data']['data'][x]['state']);
                            }
                            if (newsRes['data']['data'][x]['country'] !== null && newsRes['data']['data'][x]['country'] !== '') {
                              location.push(newsRes['data']['data'][x]['country']);
                            }
                            newsRes['data']['data'][x].location = location.join(', ');
                            this.eventsData.push(newsRes['data']['data'][x]);
                            if (newsRes['data']['data'][x]['id'] === this.newsId) {
                                data = newsRes['data']['data'][x];
                            }
                        }
                        // if (this.eventsData.length === 0) {
                        //     this.isPageLoad = true;
                        // }
                        if (this.newsId > 0 && this.notificationData['news_type'] === 1) {
                            this.selectedTab = 1;
                            const self = this;
                            setTimeout(() => {
                                $(document).ready(function () {
                                    const top = $('#event_' + self.newsId).offset().top;
                                    const kinfo_height = $('#kolInfo').outerHeight();
                                    const tab_height = $('.mat-tab-label-container').outerHeight();
                                    const sc = top - kinfo_height - tab_height - 15;
                                    $('html, body').animate({
                                        scrollTop: sc + 'px'
                                    }, 1800);
                                    if (self.notificationData['activity_type'] === 0) {
                                        setTimeout(() => {
                                            self.openLikesList(data);
                                        }, 2000);
                                    } else {
                                        document.getElementById(<any>self.newsId).click();
                                    }
                                });
                            }, 500);
                        }
                        this.isEventLoad = false;
                        this.isNewsLoadCount++;
                        this.isEventPageLoad = true;
                    } else if (type === 'twitter') {
                        if (this.isTweetsNotification && next === 0) {
                            this.callOtherAPIs('tweets');
                        }
                        this.twittersSettingsData = Object.assign({}, newsRes['data']);
                        let data = {};
                        for (const x of Object.keys(newsRes['data']['data'])) {
                            if (next === 0) {
                                this.lastView = newsRes['data']['data'][x]['last_view'];
                            }
                            if (this.isLAPP) {
                                if (this.KOLsData['favourite']) {
                                    if (this.lastView === '' || this.lastView === null) {
                                        newsRes['data']['data'][x]['read_status'] = 0;
                                    } else if (this.lastView < newsRes['data']['data'][x]['created']) {
                                        newsRes['data']['data'][x]['read_status'] = 0;
                                    } else {
                                        newsRes['data']['data'][x]['read_status'] = 1;
                                    }
                                } else {
                                    newsRes['data']['data'][x]['read_status'] = 1;
                                }
                            } else {
                                if (localStorage.getItem('isRecentSearch') !== null && localStorage.getItem('isRecentSearch') !== '' && localStorage.getItem('isRecentSearch') !== undefined) {
                                    if (this.KOLsData['favourite']) {
                                        if (this.lastView === '' || this.lastView === null) {
                                            newsRes['data']['data'][x]['read_status'] = 0;
                                        } else if (this.lastView < newsRes['data']['data'][x]['created']) {
                                            newsRes['data']['data'][x]['read_status'] = 0;
                                        } else {
                                            newsRes['data']['data'][x]['read_status'] = 1;
                                        }
                                    } else {
                                        newsRes['data']['data'][x]['read_status'] = 1;
                                    }
                                } else {
                                    if (this.lastView === '' || this.lastView === null) {
                                        newsRes['data']['data'][x]['read_status'] = 0;
                                    } else if (this.lastView < newsRes['data']['data'][x]['created']) {
                                        newsRes['data']['data'][x]['read_status'] = 0;
                                    } else {
                                        newsRes['data']['data'][x]['read_status'] = 1;
                                    }
                                }
                            }
                            newsRes['data']['data'][x]['target'] = '_blank';
                            if (newsRes['data']['data'][x]['url'] === '') {
                                newsRes['data']['data'][x]['url'] = 'javascript:void(0)';
                                newsRes['data']['data'][x]['target'] = '';
                            } else if (newsRes['data']['data'][x]['url'].indexOf('http') === -1) {
                                newsRes['data']['data'][x]['url'] = 'http://' + newsRes['data']['data'][x]['url'];
                            }
                            this.twittersData.push(newsRes['data']['data'][x]);
                            if (newsRes['data']['data'][x]['id'] === this.newsId) {
                                data = newsRes['data']['data'][x];
                            }
                        }
                        // if (this.twittersData.length === 0) {
                        //     this.isPageLoad = true;
                        // }
                        if (this.newsId > 0 && this.notificationData['news_type'] === 2) {
                            this.selectedTab = 2;
                            const self = this;
                            setTimeout(() => {
                                $(document).ready(function () {
                                    const top = $('#tweets_' + self.newsId).offset().top;
                                    const kinfo_height = $('#kolInfo').outerHeight();
                                    const tab_height = $('.mat-tab-label-container').outerHeight();
                                    const sc = top - kinfo_height - tab_height - 15;
                                    $('html, body').animate({
                                        scrollTop: sc + 'px'
                                    }, 1800);
                                    if (self.notificationData['activity_type'] === 0) {
                                        setTimeout(() => {
                                            self.openLikesList(data);
                                        }, 2000);
                                    } else {
                                        document.getElementById(<any>self.newsId).click();
                                    }
                                });
                            }, 500);
                        }
                        this.isTweetsLoad = false;
                        this.isNewsLoadCount++;
                        this.isTweetPageLoad = true;
                    }
                }
                console.log(this.isNewsLoadCount);
                if (this.isNewsLoadCount === 4 && this.isPageLoad) {
                    this.updateNewsLastView();
                }
            }).catch((err: any) => {
                console.log(err);
                if (err.status === 0 || err.status === 504) {
                    this.router.navigate([`${environment.appPrefix}`]);
                }
                this.isTweetsLoad = false;
                this.isNewsLoad = false;
                this.isEventLoad = false;
                this.isAPIRun = false;
                this.isNewsPageLoad = true;
                this.isEventPageLoad = true;
                this.isTweetPageLoad = true;
            });
    }

    /**
    * Get all Trials data by KOLs Id
    */
    getAllTrialsDataByKOLsId() {
        const postObj = {
            'page': this.currentPage,
        };

        this.kolsService.getAllTrialsDataByKOLsId(this.KOLsId, postObj)
            .then((trialsRes: any) => {
                this.isAPIRun = false;
                if (trialsRes['success']) {
                    if (this.isTrailBack && !this.isConferenceBack && this.currentPage === 1) {
                        this.callOtherAPIs('trail');
                    }
                    this.trialsSettingsData = trialsRes['data'];
                    if (trialsRes['data']['next_page']) {
                        this.nextPage = trialsRes['data']['next_page'];
                        this.currentPage += 1;
                    } else {
                        this.nextPage = false;
                    }
                    for (const x of Object.keys(trialsRes['data']['data'])) {
                        this.trialsData.push(trialsRes['data']['data'][x]);
                    }
                }
                // if (this.trialsData.length === 0) {
                this.isPageLoad = true;
                // }
                this.isTrailsLoad = false;
                if (this.isKolStatusChange) {
                    this.isTrailBack = false;
                }
                if (this.isNewsLoadCount === 4 && this.isPageLoad) {
                    this.updateNewsLastView();
                }
            }).catch((err: any) => {
                console.log(err);
                this.isTrailsLoad = false;
                this.isAPIRun = false;
                this.isPageLoad = true;
                if (this.isKolStatusChange) {
                    this.isTrailBack = false;
                }
            });
    }

    changeTabsData(event: string) {
        this.selectedTab = event['index'];
        this.renderer.removeClass(document.body, 'stickyheader');
        $('.mat-tab-header').removeClass('infoHeight');
        $('.mat-tab-header').css('top', '0px');
        if (event['index'] === 0) {
            this.newsType = 'news';
        } else if (event['index'] === 1) {
            this.newsType = 'events';
        } else if (event['index'] === 2) {
            this.newsType = 'conference';
        } else if (event['index'] === 3) {
          if (!this.isTweetsShow) {
            this.newsType = 'twitter';
          } else {
            this.newsType = '';
          }
        } else if (event['index'] === 4) {
            this.newsType = '';
        }
        this.gaKOLsTabsClicked(this.selectedTab);
    }

    clickTab() {
        this.messageService.setHttpLoaderStatus(true);
        this.spinner.show();
        setTimeout(() => {
            this.spinner.hide();
            this.messageService.setHttpLoaderStatus(false);
        }, 1200);
    }

    onResize(event: any) {
        this.infoSectionHeight = this.kolinfo.nativeElement.offsetHeight + 'px';
    }

    onWindowScroll(event: any) {
        event.preventDefault();
        this.infoSectionHeight = this.kolinfo.nativeElement.offsetHeight + 'px';
        const self = this;
        const num = window.scrollY;
        if (num > 130) {
            this.renderer.addClass(document.body, 'stickyheader');
            const q = self.infoSectionHeight;
            $('.mat-tab-header').addClass('infoHeight');
            $('.infoHeight').css('top', q);
        } else if (num < 130) {
            this.renderer.removeClass(document.body, 'stickyheader');
            $('.mat-tab-header').removeClass('infoHeight');
            $('.mat-tab-header').css('top', '0px');
        }
    }

    /**
    * Load more data when user scroll for all tabs
    * @param event
    */
    onScroll(event: any) {
        console.log(event);
        console.log(this.newsType);
        // if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if (this.newsType !== '') {
            let next = 0;
            if (this.newsType === 'news') {
                if (this.newsSettingsData !== undefined) {
                    if (this.newsSettingsData['next'] !== null) {
                        this.isNewsLoad = true;
                        next = this.newsSettingsData['next'];
                    }
                }
            } else if (this.newsType === 'events') {
                if (this.eventsSettingsData !== undefined) {
                    if (this.eventsSettingsData['next'] !== null) {
                        this.isEventLoad = true;
                        next = this.eventsSettingsData['next'];
                    }
                }
            } else if (this.newsType === 'twitter') {
                if (this.twittersSettingsData !== undefined) {
                    if (this.twittersSettingsData['next'] !== null) {
                        this.isTweetsLoad = true;
                        next = this.twittersSettingsData['next'];
                    }
                }
            } else if (this.newsType === 'conference') {
                if (this.conferenceSettingsData !== undefined) {
                    if (this.conferenceSettingsData.next) {
                        this.isConferenceLoad = true;
                        next = this.conferenceSettingsData.next;
                    }
                }
            }
            if (next > 0) {
                if (!this.isAPIRun) {
                    this.isAPIRun = true;
                    this.messageService.setHttpLoaderStatus(false);
                    if (this.newsType === 'conference') {
                        this.getAllConferencesDataByKOLsId(next);
                    } else {
                        this.getAllNewsDataByKOLsId(this.newsType, next);
                    }
                }
            }
        } else {
            if (this.nextPage) {
                if (!this.isAPIRun) {
                    this.isAPIRun = true;
                    this.isTrailsLoad = true;
                    this.messageService.setHttpLoaderStatus(false);
                    this.getAllTrialsDataByKOLsId();
                }
            } else {

            }
        }
        // }
    }

    /**
    * Like news data by news id
    * @param item
    */
    likeNews(item: any) {
        const postObj = {
            'kol_id': this.KOLsId,
            'is_for_kol': 1,
            'trial_id': 0,
            'product_id': 0
        };

        if (item.like_enabled) {
            this.messageService.setHttpLoaderStatus(true);
            this.kolsService.addLikedStatustoNews(item.id, postObj)
                .then((res: any) => {
                    if (res['success']) {
                        item.like_count = res['data']['like_count'];
                        item.like_enabled = false;
                    } else {
                        this.utilService.showError('Error', res['message']);
                    }
                }).catch((err: any) => {
                    console.log(err);
                    this.utilService.showError('Error', err['message']);
                });
        }
    }

    /**
    * Comments on news data by news id
    * @param item
    */
    addCommentForNews(item: any) {
        item.showUserList = false;
        item.sendText = item.commentText;
        this.allUserList.filter((list: any) => {
            const name = list.first_name + ' ' + list.last_name;
            if (item.sendText.indexOf('user_' + list.id + '_id') > -1) {
                item.sendText = item.sendText.replace(name, '`' + list.id + '`');
            }
        });
        item.sendText = item.sendText.replace(/(<([^>]+)>)/ig, '');
        item.sendText = item.sendText.replace(/ {1,}/g, ' ');
        const postObj = {
            'comment': item.sendText,
            'kol_id': parseInt(this.KOLsId, 0),
            'is_for_kol': 1,
            'trial_id': 0,
        };
        this.kolsService.addCommentForNews(item.id, postObj)
            .then((res: any) => {
                if (res['success']) {
                    $('#myinputtext_' + item.id).html('');
                    item.commentText = '';
                    item.comments.unshift(res['data']['data']);
                    item.comment_count += 1;
                } else {
                    this.utilService.showError('Error', res['message']);
                }
            }).catch((err: any) => {
                console.log(err);
                this.utilService.showError('Error', err['message']);
            });
    }

    /**
    * Open Trails news detail page
    * @param item
    */
    trialNewsData(item: any) {
        item.kol_id = this.KOLsId;
        item.is_notification = false;
        localStorage.setItem('ktrials_data', JSON.stringify(item));
        localStorage.setItem('kselected_tab', <any>this.selectedTab);
        this.router.navigate([`${environment.appPrefix}/kol-trial-related-news`]);
    }

    /**
    * add event data to google calendar
    * @param item
    */
    addEventToCalendar(item) {
        this.kolsService.getICSFileForCalender(item.id)
            .then((res: any) => {
                if (res['success']) {
                    let url = '';
                    if (res['data'].indexOf('https') > -1) {
                        url = res['data'].replace('https', 'webcal');
                    } else {
                        url = res['data'].replace('http', 'webcal');
                    }
                    const result = window.open(url, '_self');
                    console.log(result);
                }
            }).catch((err: any) => {
                console.log(err);
            });
    }

    dataURLtoBlob(dataurl: any) {
        const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1];
        const bstr = arr[1];
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    /**
    * changes news read/unread staus when click on it
    * @param item
    */
    changeNewsReadStatus(item: any) {
        item.read_status = 1;
    }

    /**
    * check image is exist or not if not than create placehoolder image with kol firstname and lastname
    */
    checkImageExistorNot() {
        if (this.KOLsData !== undefined) {
            this.KOLsData['kol_image_url'] = '';
            const _name = this.KOLsData.kol_full_name;
            if (_name !== null && _name !== undefined) {
                if (this.KOLsData.kol_first_name !== null) {
                    this.KOLsData['kol_short_name'] = `${this.KOLsData.kol_first_name.split(' ')[0][0]}`;
                }
                if (this.KOLsData.kol_last_name !== null) {
                    this.KOLsData['kol_short_name'] = this.KOLsData['kol_short_name'] + `${this.KOLsData.kol_last_name.split(' ')[0][0]}`;
                }
            }
        }
    }

    /**
    *  scroll on comment box when opne in mobile view
    * @param event
    * @param item
    */
    commentFocus(event: any, item: any) {
        const self = this;
        $(document).ready(function () {
            if (self.utilService.checkRunningPlatformType()) {
                const top = $('#myinputtext_' + item.id).offset().top;
                const sc = top - 200;
                $('html, body').animate({
                    scrollTop: sc + 'px'
                }, 1000);
            }
        });
        if (this.selectedTab === 0 || this.selectedTab === null) {
            this.newsData.filter((list: any) => {
                if (item.id !== list.id) {
                    list.showUserList = false;
                }
            });
        } else if (this.selectedTab === 1) {
            this.eventsData.filter((list: any) => {
                if (item.id !== list.id) {
                    list.showUserList = false;
                }
            });
        } else if (this.selectedTab === 2) {
            this.twittersData.filter((list: any) => {
                if (item.id !== list.id) {
                    list.showUserList = false;
                }
            });
        }
        if (this.keyData !== ' ') {
            this.openUserList('', item);
        }

        const update = function () {
            const position = getCaretPosition(this);
            if (position === <any>'@') {
                item.showUserList = true;
                self.isShow = true;
            } else {
                item.showUserList = false;
                self.isShow = false;
            }
        };

        $('#myinputtext_' + item.id).on('mouseup', update);

        function getCaretPosition(editableDiv) {
            let caretPos = 0,
                sel, range;
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.rangeCount) {
                    range = sel.getRangeAt(0).cloneRange();
                    range.collapse(true);
                    range.setStart(editableDiv, 0);
                    caretPos = range.toString().slice(-1);
                }
            }
            return caretPos;
        }
    }

    /**
    * add to bookmark news item
    * @param item
    */
    addNewsItemToBookmark(item: any) {
        this.messageService.setHttpLoaderStatus(true);
        if (item.is_bookmark) {
            this.kolsService.removeBookmarkNewsById(item.id)
                .then((res: any) => {
                    if (res['success']) {
                        item.is_bookmark = false;
                        this.utilService.showCustom('Bookmark removed.');
                    } else {
                        this.utilService.showError('Error', res['message']);
                    }
                }).catch((err: any) => {
                    console.log(err);
                    this.utilService.showError('Error', err['message']);
                });
        } else {
            this.kolsService.addBookmarkNewsById(item.id, this.KOLsId)
                .then((res: any) => {
                    if (res['success']) {
                        item.is_bookmark = true;
                        this.utilService.showCustom('Bookmark added.');
                    } else {
                        this.utilService.showError('Error', res['message']);
                    }
                }).catch((err: any) => {
                    console.log(err);
                    this.utilService.showError('Error', err['message']);
                });
        }
    }

    getTooltipData(item: any) {
        if (item.is_bookmark) {
            return 'Unbookmark';
        } else {
            return 'Bookmark';
        }
    }

    getTooltipDataForTrail(item: any) {
        if (item.is_bookmarked) {
            return 'Unbookmark';
        } else {
            return 'Bookmark';
        }
    }

    /**
    * add to bookmark trials data
    * @param item
    */
    addTrialsToBookmark(item: any) {
        this.messageService.setHttpLoaderStatus(true);
        if (item.is_bookmarked) {
            this.kolsService.removeBookmarkTrailsById(item.id)
                .then((res: any) => {
                    if (res['success']) {
                        item.is_bookmarked = false;
                        this.utilService.showCustom('Bookmark removed.');
                    } else {
                        this.utilService.showError('Error', res['message']);
                    }
                }).catch((err: any) => {
                    console.log(err);
                    this.utilService.showError('Error', err['message']);
                });
        } else {
            this.kolsService.addBookmarkTrailsById(item.id, this.KOLsId)
                .then((res: any) => {
                    if (res['success']) {
                        item.is_bookmarked = true;
                        this.utilService.showCustom('Bookmark added.');
                    } else {
                        this.utilService.showError('Error', res['message']);
                    }
                }).catch((err: any) => {
                    console.log(err);
                    this.utilService.showError('Error', err['message']);
                });
        }
    }

    checkValidValue(text: String) {
        if (text.trim() === '') {
            return true;
        } else {
            return false;
        }
    }

    getNewsSummary(summary: any) {
        if (summary[0] === '"' && summary[summary.length - 1] === '"') {
            return summary;
        } else {
            return '"' + summary + '"';
        }
    }

    imageLoadSuccess() {
        this.KOLsData['imageLoad'] = true;
    }

    /**
    * create placeholder image with user firstname and lastname
    * @param item
    */
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

    getProductName(name: String) {
        if (name !== '' && name !== null && name !== undefined) {
            let newName: any;
            if (name.indexOf('(') === 0) {
                newName = name.split(')');
                if (newName.length > 1) {
                    return newName[1].trim();
                } else {
                    return name;
                }
            } else {
                newName = name.split('(');
                if (newName.length > 1) {
                    return newName[0].trim();
                } else {
                    return name;
                }
            }
        }
    }

    onKeydown(event: any) {
        this.keyData = null;
        if (event.keyCode !== 35 && event.keyCode !== 36 && event.keyCode !== 8 && event.keyCode !== 46) {
            if (event.keyCode === 32) {
                this.keyData = ' ';
            } else {
                this.keyData = event.keyCode;
            }
        }
        if (event.keyCode === 13) {
            this.keyData = event.keyCode;
            document.execCommand('insertHTML', false, '');
            return false;
        }
    }

    /**
    * Open existing user list for mentions in comment box
    * @param event
    * @param item
    */
    openUserList(event: any, item: any) {
        let last = null;
        let isFirst = false;
        if (navigator.userAgent.match(/Android/i) !== null) {
            this.keyData = event.data;
        }
        if (this.keyData !== null) {
            let data = $('#myinputtext_' + item.id).html();
            if (item.commentText === '' && data.length > 1) {
                isFirst = true;
                data = data.replace(/(<([^>]+)>)/ig, '');
            }
            if ($.trim($('div[contenteditable]').text()).length > 0) {
                item.commentText = data;
            } else {
                item.commentText = '';
            }
            item.commentText = item.commentText.replace(/<br\s*\/?>/gi, '');
            if (item.commentText.length > 0) {
                last = item.commentText.slice(-1);
                last = last.replace('>', '');
            }
            if (this.keyData === ' ') {
                let str = '';
                if (item.commentText.length > 1) {
                    str = item.commentText.slice(-2);
                }
                if (str.trim() === '@') {
                    item.isSearch = false;
                    item.showUserList = false;
                    this.isShow = false;
                }
            }
            if (last !== null) {
                if (last === '@') {
                    item.isSearch = true;
                    item.showUserList = true;
                    this.isShow = true;
                } else {
                    item.showUserList = false;
                }
            } else {
                item.showUserList = false;
            }
            if (this.keyData === 13) {
                item.isSearch = false;
                item.showUserList = false;
                this.isShow = false;
            }
            this.manageUserlistData(item, last);
            const self = this;
            $(document).ready(function () {
                $('.user-name-popup').scroll(function () {
                    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                        self.onUserListScroll();
                    } else {
                        console.log('b');
                    }
                });

                let textData = $('#myinputtext_' + item.id).html();
                if (isFirst) {
                    textData = textData.replace(/(<([^>]+)>)/ig, '');
                    isFirst = false;
                    $('#myinputtext_' + item.id).html(textData);
                }
                // $('#myinputtext_' + item.id).html(data);
                const elem = document.getElementById('myinputtext_' + item.id); // This is the element that you want to move the caret to the end of
                if (self.keyData !== null) {
                    // setEndOfContenteditable(elem);
                }

                function setEndOfContenteditable(contentEditableElement: any) {
                    let range, selection;
                    if (document.createRange) { // Firefox, Chrome, Opera, Safari, IE 9+
                        range = document.createRange();
                        range.selectNodeContents(contentEditableElement);
                        range.collapse(false);
                        selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }

                elem.onkeydown = function (event1: any) {
                    if (event1.keyCode === 35) {
                        elem.focus();
                        setEndOfContenteditable(elem);
                    }
                };
            });
        } else {
            item.showUserList = false;
            let lastKey = '';
            const data = $('#myinputtext_' + item.id).html();
            if ($.trim($('div[contenteditable]').text()).length > 0) {
                item.commentText = data;
                item.commentText = item.commentText.replace(/<br\s*\/?>/gi, '');
                if (item.commentText.length > 0) {
                    lastKey = item.commentText.slice(-1);
                }
            } else {
                item.commentText = '';
                lastKey = '';
            }
            if (lastKey !== '') {
                if (lastKey === '@') {
                    item.isSearch = true;
                    item.showUserList = true;
                    this.isShow = true;
                    this.manageUserlistData(item, lastKey);
                } else {
                    if (item.isSearch && lastKey !== ' ') {
                        item.showUserList = true;
                        this.manageUserlistData(item, lastKey);
                    } else {
                        item.showUserList = false;
                    }
                }
            } else {
                item.showUserList = false;
                this.manageUserlistData(item, lastKey);
            }
            if (item.commentText === '') {
                item.isSearch = false;
                this.isShow = false;
                $('#myinputtext_' + item.id).html('');
            }
        }
    }

    /**
    * search user from existing when user type any letter after @ in comment box
    * @param item
    * @param last
    */
    manageUserlistData(item: any, last: any) {
        const str = item.commentText;
        const search = item.commentText.substring(item.commentText.lastIndexOf('@') + 1, item.commentText.length);
        if (search !== '') {
            const searchData = [];
            this.allUserList.filter(list => {
                if (list.full_name.toLowerCase().includes(search.toLowerCase())) {
                    if (str.indexOf('user_' + list.id + '_id') === -1) {
                        searchData.push(list);
                    }
                }
            });
            if (item.isSearch) {
                item.showUserList = true;
            }
            this.userList = searchData;
        } else {
            const searchData = [];
            this.allUserList.filter((list: any) => {
                if (str.indexOf('user_' + list.id + '_id') === -1) {
                    searchData.push(list);
                }
            });
            this.userList = searchData;
            if (item.isSearch) {
                item.showUserList = true;
            }
        }
        if (item.commentText === '') {
            item.showUserList = false;
            item.isSearch = false;
            this.isShow = false;
        }
    }

    /**
    * Add user name in comment
    * @param user
    * @param item
    */
    selectUserForComment(user: any, item: any) {
        const isChrome = navigator.userAgent.indexOf('Chrome');
        const isFirfox = navigator.userAgent.indexOf('Firefox');
        item.isSearch = false;
        this.isShow = false;
        item.commentText = item.commentText.substring(0, item.commentText.lastIndexOf('@'));
        if (isFirfox !== -1) {
            // tslint:disable-next-line: max-line-length
            item.commentText = item.commentText + `<span contentEditable="true" unselectable="on" class="name-tag-new" id="user_` + user.id + `_id">` + user.first_name + ' ' + user.last_name + ` </span>`;
        } else {
            if (navigator.userAgent.match(/Android/i) !== null) {
                item.commentText = item.commentText + `<span contentEditable="true" unselectable="on" class="name-tag-new" id="user_` + user.id + `_id">` + user.first_name + ' ' + user.last_name + ` </span>` + ' ';
            } else {
                item.commentText = item.commentText + `<span contentEditable="false" unselectable="on" class="name-tag-new" id="user_` + user.id + `_id">` + user.first_name + ' ' + user.last_name + ` </span>` + ' ';
            }
        }
        item.showUserList = false;
        $(document).ready(function () {
            $('#myinputtext_' + item.id).html(item.commentText);
            const elem = document.getElementById('myinputtext_' + item.id); // This is the element that you want to move the caret to the end of
            setEndOfContenteditable(elem);

            function setEndOfContenteditable(contentEditableElement: any) {
                let range, selection;
                if (document.createRange) { // Firefox, Chrome, Opera, Safari, IE 9+
                    range = document.createRange();
                    range.selectNodeContents(contentEditableElement);
                    range.collapse(false);
                    selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                    contentEditableElement.focus();
                    const ele = $('#myinputtext_' + item.id);
                    ele.scrollTop(ele[0].scrollHeight);
                    $('#myinputtext_' + item.id).trigger('focus');
                }
            }
        });
    }

    /**
    * get list of user that is used in web mentions for comment
    */
    getUserListForComment() {
        if (this.userCurrentPage === 1) {
            this.userList = [];
            this.allUserList = [];
        }
        this.kolsService.getUserListForComment()
            .then((res: any) => {
                console.log(res);
                if (res['success']) {
                    this.isNextUserPage = res['data']['next_page'];
                    if (this.isNextUserPage) {
                        this.userCurrentPage++;
                    }
                    res['data']['data'].filter((item: any) => {
                        this.allUserList.push(item);
                    });
                    this.allUserList.filter((item: any) => {
                        this.userList.push(item);
                    });
                }
            }).catch((err: any) => {
                console.log(err);
            });
    }

    onUserListScroll() {
        if (this.isNextUserPage) {
            this.messageService.setHttpLoaderStatus(false);
            this.getUserListForComment();
        }
    }

    /**
    * Update last view of news items
    */
    updateNewsLastView() {
      if (this.router.url.indexOf('kol-entity') > -1) {
        this.messageService.setHttpLoaderStatus(false);
      }
        this.kolsService.updateNewsLastView(this.KOLsId)
            .then((res: any) => {
                if (res['success']) {
                    console.log(res);
                }
                // this.messageService.setHttpLoaderStatus(true);
            }).catch((err: any) => {
                console.log(err);
                // this.messageService.setHttpLoaderStatus(true);
            });
    }

    /**
    * check upcoming event data is showing for registered user or not
    */
    checkShowEvent() {
        if (this.KOLsData !== undefined) {
            if (this.eventsData.length === 0 && !this.KOLsData.favourite) {
                if (this.isLAPP) {
                    if (this.usersData.favourite_kols_count === 3) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        }
    }

    /**
    * check upcoming event data is showing for free user or not
    */
    checkShowEventFreeUser() {
        if (this.KOLsData !== undefined) {
            if (this.eventsData.length === 0 && !this.KOLsData.favourite) {
                if (this.isLAPP) {
                    if (this.usersData.favourite_kols_count === 3) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    /**
    * Image slider popup in tweet tab for multiple images
    */
    showPopup(item: any, content: string) {
        if (item.images.original.length > 1) {
            const activeModal = this.modalService.open(KolEntityImageComponent, { size: 'sm', windowClass: 'tweet-image-popup' });
            activeModal.componentInstance.news_images = item.images.original;
        }
    }

    callOtherAPIs(type: any) {
      if (this.router.url.indexOf('kol-entity') > -1) {
        this.messageService.setHttpLoaderStatus(false);
        this.getUserListForComment();
        if (this.isTrailBack && type !== 'news') {
            this.isNewsLoad = true;
            this.isTweetsLoad = true;
            this.isEventLoad = true;
            this.getAllNewsDataByKOLsId('news', 0);
            this.getAllNewsDataByKOLsId('events', 0);
            this.getAllNewsDataByKOLsId('twitter', 0);
        } else if (this.isConferenceBack && type !== 'news') {
            this.isNewsLoad = true;
            this.isTweetsLoad = true;
            this.isEventLoad = true;
            this.getAllNewsDataByKOLsId('news', 0);
            this.getAllNewsDataByKOLsId('events', 0);
            this.getAllNewsDataByKOLsId('twitter', 0);
        } else if (this.isNewsNotification) {
            this.isTweetsLoad = true;
            this.isEventLoad = true;
            this.getAllNewsDataByKOLsId('events', 0);
            this.getAllNewsDataByKOLsId('twitter', 0);
        } else if (this.isEventsNotification) {
            this.isNewsLoad = true;
            this.isTweetsLoad = true;
            this.getAllNewsDataByKOLsId('news', 0);
            this.getAllNewsDataByKOLsId('twitter', 0);
        } else if (this.isTweetsNotification) {
            this.isNewsLoad = true;
            this.isEventLoad = true;
            this.getAllNewsDataByKOLsId('news', 0);
            this.getAllNewsDataByKOLsId('events', 0);
        } else if (!this.isTrailBack && type === 'news' && this.newsId === 0) {
            this.isTweetsLoad = true;
            this.isEventLoad = true;
            this.getAllNewsDataByKOLsId('events', 0);
            this.getAllNewsDataByKOLsId('twitter', 0);
        }
        if (type !== 'trail') {
            this.isTrailsLoad = true;
            this.getAllTrialsDataByKOLsId();
        }
        if (type !== 'conference') {
            this.isConferenceLoad = true;
            this.getAllConferencesDataByKOLsId(0);
        }
      }
    }

    /**
    * refresh the page after premium/nonpremium kol by user
    */
    changeDataByUser(event: any) {
        this.messageService.setHttpLoaderStatus(true);
        this.newsSettingsData = '';
        this.newsData = [];
        this.currentPage = 1;
        this.isNewsPageLoad = false;
        this.twittersData = [];
        this.twittersSettingsData = '';
        this.isTweetPageLoad = false;
        this.eventsData = [];
        this.eventsSettingsData = '';
        this.isEventPageLoad = false;
        this.trialsData = [];
        this.isPageLoad = false;
        this.isKolDataChange = true;
        this.isNewsNotification = false;
        this.isTweetsNotification = false;
        this.isEventsNotification = false;
        this.isTrailBack = false;
        this.conferenceSettingsData = '';
        this.conferenceData = [];
        this.isConferencePageLoad = false;
        this.isNewsNotification = false;
        this.isKolStatusChange = true;
        if (this.selectedTab === 0) {
            this.isNewsNotification = true;
            this.getAllNewsDataByKOLsId('news', 0);
        } else if (this.selectedTab === 1) {
            this.isEventsNotification = true;
            this.getAllNewsDataByKOLsId('events', 0);
        } else if (this.selectedTab === 3) {
            if (!this.isTweetsShow) {
                this.isTweetsNotification = true;
                this.getAllNewsDataByKOLsId('twitter', 0);
            } else {
                this.isTrailBack = true;
                this.getAllTrialsDataByKOLsId();
            }
        } else if (this.selectedTab === 2) {
            this.isConferenceBack = true;
            this.getAllConferencesDataByKOLsId(0);
        } else {
            this.isTrailBack = true;
            this.getAllTrialsDataByKOLsId();
        }
    }

    /**
    * Get all Conferences data by KOLs Id
    */
    getAllConferencesDataByKOLsId(next: number) {
        const postObj = {
            'page': this.currentPage,
        };

        if (next > 0) {
            postObj['next'] = next;
        }

        this.conferenceService.getAllConferencesDataByKOLsId(this.KOLsId, postObj)
            .then((conferenceRes: any) => {
                console.log(conferenceRes);
                this.isAPIRun = false;
                if (conferenceRes['success']) {
                    if (this.isConferenceBack && !this.isTrailBack && next === 0) {
                        this.callOtherAPIs('conference');
                    }
                    this.conferenceSettingsData = conferenceRes['data'];
                    if (conferenceRes['data'] !== null) {
                        for (const x of Object.keys(conferenceRes['data']['data'])) {
                            const data = [];
                            if (conferenceRes['data']['data'][x]['city'] !== null && conferenceRes['data']['data'][x]['city'] !== '') {
                                data.push(conferenceRes['data']['data'][x]['city']);
                            }
                            if (conferenceRes['data']['data'][x]['state'] !== null && conferenceRes['data']['data'][x]['state'] !== '') {
                                data.push(conferenceRes['data']['data'][x]['state']);
                            }
                            if (conferenceRes['data']['data'][x]['country'] !== null && conferenceRes['data']['data'][x]['country'] !== '') {
                                data.push(conferenceRes['data']['data'][x]['country']);
                            }
                            const date1 = new Date(conferenceRes['data']['data'][x]['start_date']);
                            const date2 = new Date(conferenceRes['data']['data'][x]['end_date']);
                            if (date1.getMonth() === date2.getMonth()) {
                                conferenceRes.data.data[x].isSameMonth = true;
                            } else {
                                conferenceRes.data.data[x].isSameMonth = false;
                            }
                            conferenceRes.data.data[x].location = data.join(', ');
                            this.conferenceData.push(conferenceRes['data']['data'][x]);
                        }
                    }
                    console.log(this.conferenceData);
                    this.isConferenceLoad = false;
                    this.isConferencePageLoad = true;
                    if (this.isKolStatusChange) {
                        this.isConferenceBack = false;
                    }
                    this.isNewsLoadCount++;
                    console.log(this.isNewsLoadCount);
                    if (this.isNewsLoadCount === 4 && this.isPageLoad) {
                        this.updateNewsLastView();
                    }
                }
            }).catch((err: any) => {
                console.log(err);
                this.isConferenceLoad = false;
                this.isConferencePageLoad = true;
                this.isAPIRun = false;
                if (this.isKolStatusChange) {
                    this.isConferenceBack = false;
                }
            });
    }

    /** Open the detail page of conference iteration */
    openConferenceNewsData(item: any) {
        console.log(item);
        item.kol_id = this.KOLsId;
        item.is_notification = false;
        localStorage.setItem('kconference_data', JSON.stringify(item));
        localStorage.setItem('kselected_tab', <any>this.selectedTab);
        this.router.navigate([`${environment.appPrefix}/conference-detail`]);
    }

/*  Google analytics event tracking */
/*  Google analytics bookmark event tracking */
    gaKOLsBookmarks(item: any, news_type: any) {    
        EventsData.KolsBookmarkLabel = news_type;
        if (item.is_bookmark === false) {
            EventsData.KolsBookmarkAction = item.kols[0].kapp_full_name;
            this.gaService.emitEvent(EventsData.KolsBookmarkCategory,EventsData.KolsBookmarkAction, EventsData.KolsBookmarkLabel, 10);
        }
        else if(item.is_bookmarked === false){
            EventsData.KolsBookmarkAction =  localStorage.getItem('header_title');
            this.gaService.emitEvent(EventsData.KolsBookmarkCategory,EventsData.KolsBookmarkAction, EventsData.KolsBookmarkLabel, 10);
        }
    }
/*  Google analytics tab clicked event tracking for Kols*/
    gaKOLsTabsClicked(selectedTab){
        if(selectedTab === 0){
          EventsData.kolsTabsClickedLabel = 'news'
          this.gaService.emitEvent(EventsData.kolsTabsClickedCategory,EventsData.kolsTabsClickedAction,EventsData.kolsTabsClickedLabel,10);
        }
        else if(selectedTab === 1){
            EventsData.kolsTabsClickedLabel    = 'events'
            this.gaService.emitEvent(EventsData.kolsTabsClickedCategory,EventsData.kolsTabsClickedAction,EventsData.kolsTabsClickedLabel,10);
        }
        else if(selectedTab === 2){
            EventsData.kolsTabsClickedLabel = 'conference'
            this.gaService.emitEvent(EventsData.kolsTabsClickedCategory,EventsData.kolsTabsClickedAction,EventsData.kolsTabsClickedLabel,10);
        }
        else if(selectedTab === 3){
            EventsData.kolsTabsClickedLabel    = 'twitter'
            this.gaService.emitEvent(EventsData.kolsTabsClickedCategory,EventsData.kolsTabsClickedAction,EventsData.kolsTabsClickedLabel,10);
        }
        else if(selectedTab === 4){
            EventsData.kolsTabsClickedLabel  = 'trials'
            this.gaService.emitEvent(EventsData.kolsTabsClickedCategory,EventsData.kolsTabsClickedAction,EventsData.kolsTabsClickedLabel,10);
        }
    }
    /*  Google analytics tab #Links clicked event tracking for Kols*/
    gaVisitedLinks(item){  
        EventsData.kolsLinksClickedLabelItemId = item;
        let selectedTab = Number(this.selectedTab) 
        EventsData.kolsLinksClickedAction = localStorage.getItem('header_title');
        if( selectedTab === 0){
            EventsData.kolsLinksClickedLabelNewsType = 'news'
            this.gaService.emitEvent(EventsData.kolsLinksClickedCategory,EventsData.kolsLinksClickedAction, EventsData.kolsLinksClickedLabelNewsType+"Id"+ EventsData.kolsLinksClickedLabelItemId,10);
          }
          else if( selectedTab === 1){
            EventsData.kolsLinksClickedLabelNewsType = 'events'
              this.gaService.emitEvent(EventsData.kolsLinksClickedCategory,EventsData.kolsLinksClickedAction, EventsData.kolsLinksClickedLabelNewsType+"Id"+ EventsData.kolsLinksClickedLabelItemId, 10);
          }
          else if( selectedTab === 2 ){
            EventsData.kolsLinksClickedLabelNewsType = 'conference'
              this.gaService.emitEvent(EventsData.kolsLinksClickedCategory,EventsData.kolsLinksClickedAction, EventsData.kolsLinksClickedLabelNewsType+"Id"+ EventsData.kolsLinksClickedLabelItemId, 10);
          }
          else if( selectedTab === 3){
            EventsData.kolsLinksClickedLabelNewsType = 'twitter'
              this.gaService.emitEvent(EventsData.kolsLinksClickedCategory,EventsData.kolsLinksClickedAction, EventsData.kolsLinksClickedLabelNewsType+"Id"+ EventsData.kolsLinksClickedLabelItemId,10);
          }
          else if( selectedTab === 4){
            EventsData.kolsLinksClickedLabelNewsType = 'trials'
              this.gaService.emitEvent(EventsData.kolsLinksClickedCategory,EventsData.kolsLinksClickedAction, EventsData.kolsLinksClickedLabelNewsType+"Id"+ EventsData.kolsLinksClickedLabelItemId, 10);
          }
    }
    /*  Google analytics calendar event tracking for Kols*/
    gaTrackCalendarEvent(item){
        EventsData.kolsCalendarItemIdLabel = item
        EventsData.kolsCalendarpAction = localStorage.getItem('header_title');
        let selectedTab = Number( this.selectedTab)
        if( selectedTab === 1){
            EventsData.kolsCalendarNewsTypeLabel = 'events'
            this.gaService.emitEvent(EventsData.kolsCalendarCategory,EventsData.kolsCalendarpAction, EventsData.kolsCalendarNewsTypeLabel+"Id"+  EventsData.kolsCalendarItemIdLabel, 10);
        }
    }
}
