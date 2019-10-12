import { Component, OnInit, OnDestroy, Renderer2, ElementRef, ViewChild, ChangeDetectorRef, HostListener} from '@angular/core';
import { environment } from './../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './../../../core/service/message/message.service';
import { DrugsService } from './../../../core/service/drugs/drugs.service';
import { UtilService } from './../../../core/service/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KolEntityImageComponent } from './../../common/kol-entity-image/kol-entity-image.component';
import { KolsService } from './../../../core/service/kols/kols.service';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { GoogleAnalyticsService } from 'src/app/core/service/google-analytics.service';
import { EventsData } from 'src/app/core/service/gaEventsData';

declare var $: any;

@Component({
    selector: 'app-drug-entity-page',
    templateUrl: './drug-entity-page.component.html',
    styleUrls: ['./drug-entity-page.component.scss']
})
export class DrugEntityPageComponent implements OnInit, OnDestroy {

    @ViewChild('kolInfo') kolinfo: ElementRef;
    ProductData: any;
    productId: any;
    isAPIRun = false;
    newsSettingsData: any;
    lastView: any = '';
    isLAPP = false;
    usersData: any;
    userDataRef: any;
    newsData: any = [];
    isNewsPageLoad = false;
    isNewsLoad = false;
    isPageLoad = false;
    newsType = 'news';
    public selectedTab = 0;
    twittersSettingsData: any;
    isTweetsLoad = false;
    twittersData: any = [];
    nextPage = false;
    trialsData: any = [];
    trialsSettingsData: any;
    showDetail = false;
    isNewsLoadCount = 0;
    currentPage = 1;
    isTrailsLoad = false;
    isFShow = false;
    allUserList: any = [];
    commentBoxRef: any;
    isTweetsShow = true;
    isBookmarkAPIRun = false;
    notificationData: any;
    newsId = 0;
    infoSectionHeight = '100px';
    discontinuedStatus: any;
    discontinuedAreas: any;
    isTweetsPageLoad = false;

    @HostListener('document:click', ['$event'])
    clickout(event: any) {
        if (event.srcElement.className.indexOf('mat-tab-label-content') > -1 || event.srcElement.className.indexOf('mat-tab-label-active') > -1) {
           this.clickTab();
        }
    }

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService,
        private drugsService: DrugsService,
        private utilService: UtilService,
        private modalService: NgbModal,
        private kolsService: KolsService,
        private renderer: Renderer2,
        private change: ChangeDetectorRef,
        private spinner: SpinnerVisibilityService,
        private gaService:GoogleAnalyticsService
    ) {
        setTimeout(() => {
            this.infoSectionHeight = this.kolinfo.nativeElement.offsetHeight + 'px';
        }, 500);

        this.activatedRoute.params.subscribe(data => {
            if (data.hasOwnProperty('id')) {
                this.productId = atob(data.id);
            } else {
                this.router.navigate([`${environment.appPrefix}`]);
            }
        });

        if (localStorage.getItem('knews_item') !== null) {
            this.notificationData = <any>JSON.parse(localStorage.getItem('knews_item'));
            this.newsId = this.notificationData['id'];
            localStorage.removeItem('knews_item');
        }

        this.usersData = this.utilService.getLoggedUserData();

        this.userDataRef = this.messageService.getLoggedUserData().subscribe(res => {
            this.usersData = this.utilService.getLoggedUserData();
        });

        if (this.usersData !== null || this.usersData !== undefined || this.usersData !== '') {
            if (this.usersData['organizations'].length === 0) {
                this.isLAPP = true;
            }
        }

        this.commentBoxRef = this.messageService.getOpenCommentBoxStatus().subscribe((res: any) => {
            if (this.selectedTab === 0 || this.selectedTab === null) {
                this.newsData.filter((list: any) => {
                    if (list.id !== res.id) {
                        list.isShow = false;
                    }
                    list.showUserList = false;
                });
            } else if (this.selectedTab === 1) {
                this.twittersData.filter((list: any) => {
                    if (list.id !== res.id) {
                        list.isShow = false;
                    }
                    list.showUserList = false;
                });
            }
        });

        this.getProductDetailById();
        this.getUserListForComment();
    }

    ngOnInit() {
        localStorage.setItem('selectedEntity', 'drug');
        this.messageService.setKolsData({});
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.messageService.setHttpLoaderStatus(true);
        this.isPageLoad = false;

        this.renderer.removeClass(document.body, 'stickyheader');
        $('.mat-tab-header').removeClass('infoHeight');
        $('.mat-tab-header').css('top', '0px');

        if (localStorage.getItem('kselected_tab') !== null && localStorage.getItem('kselected_tab') !== undefined) {
            this.selectedTab = <any>localStorage.getItem('kselected_tab');
            this.newsType = '';
            localStorage.removeItem('kselected_tab');
        }
    }

    ngOnDestroy() {
        this.messageService.setHttpLoaderStatus(true);

        if (!!this.userDataRef) {
            this.userDataRef.unsubscribe();
        }

        if (!!this.commentBoxRef) {
            this.commentBoxRef.unsubscribe();
        }
    }

    /**
    * Get Product(Drug) detail by Product id
    */
    getProductDetailById() {
        this.drugsService.getProductDetailById(this.productId)
            .then(res => {
                console.log(res);
                if (res['success']) {
                    this.ProductData = res['data'];
                    if (this.ProductData.name !== null) {
                        if (this.router.url !== '/home') {
                            localStorage.setItem('header_title', this.ProductData.name);
                            this.messageService.setKolsData(this.ProductData.name);
                        }
                    } else {
                        localStorage.setItem('header_title', '');
                        this.messageService.setKolsData('');
                    }

                    if (this.ProductData['phase'] !== undefined) {
                        for (const x of Object.keys(this.ProductData['phase'])) {
                            if ((x.indexOf('Phase 2') === -1) && (x.indexOf('Phase 1') === -1) && (x.indexOf('Phase 3') === -1) && (x.indexOf('Marketed') === -1) && (x.indexOf('Filed') === -1)) {
                                this.discontinuedStatus = x;
                                this.discontinuedAreas = this.ProductData['phase'][x].join(', ');
                            }
                        }
                        if (this.ProductData['phase']['Marketed'] !== undefined) {
                            this.ProductData['phase']['marketed'] = this.ProductData['phase']['Marketed'].join(', ');
                        }
                        if (this.ProductData['phase']['Phase 1'] !== undefined) {
                            this.ProductData['phase']['phase_1'] = this.ProductData['phase']['Phase 1'].join(', ');
                        }
                        if (this.ProductData['phase']['Phase 2'] !== undefined) {
                            this.ProductData['phase']['phase_2'] = this.ProductData['phase']['Phase 2'].join(', ');
                        }
                        if (this.ProductData['phase']['Phase 3'] !== undefined) {
                            this.ProductData['phase']['phase_3'] = this.ProductData['phase']['Phase 3'].join(', ');
                        }
                        if (this.ProductData['phase']['Filed'] !== undefined) {
                            this.ProductData['phase']['filed'] = this.ProductData['phase']['Filed'].join(', ');
                        }
                    }

                    setTimeout(() => {
                        this.isFShow = true;
                    }, 300);

                    this.getAllTrialsDataByProductId();
                    this.getAllNewsDataByProductId('news', 0);
                    this.getAllNewsDataByProductId('twitter', 0);
                }
            }).catch(err => {
                console.log(err);
                this.isNewsPageLoad = true;
                this.isNewsLoad = false;
                this.isTweetsLoad = false;
                this.isAPIRun = false;
                this.isFShow = true;
            });
    }

    /**
    * Redirect the user to Drug Landing page
    */
    redirectOnLandingPage() {
        localStorage.setItem('selectedEntity', 'drug');
        this.router.navigate(['/home']);
    }

    /**
    * Get News/Tweets data by product id and type
    * @param type
    * @param next
    */
    getAllNewsDataByProductId(type: any, next: any) {
        const postObj = {
            'type': type,
        };

        if (next > 0) {
            postObj['next'] = next;
        }

        this.drugsService.getAllNewsByProductId(this.productId, postObj)
            .then((newsRes: any) => {
                console.log(newsRes);
                this.isAPIRun = false;
                if (newsRes['success']) {
                    this.isTweetsShow = newsRes['data']['is_excutable'];
                    if (type === 'news') {
                        this.newsSettingsData = newsRes['data'];
                        let data = {};
                        for (const x of Object.keys(newsRes['data']['data'])) {
                            if (next === 0) {
                                this.lastView = newsRes['data']['data'][x]['last_view'];
                            }

                            if (this.isLAPP) {
                                if (this.ProductData['favourite']) {
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
                            newsRes['data']['data'][x]['isShow'] = false;
                            newsRes['data']['data'][x]['target'] = '_blank';
                            if (newsRes['data']['data'][x]['url'] === '') {
                                newsRes['data']['data'][x]['url'] = 'javascript:void(0)';
                                newsRes['data']['data'][x]['target'] = '';
                            } else if (newsRes['data']['data'][x]['url'].indexOf('http') === -1) {
                                newsRes['data']['data'][x]['url'] = 'http://' + newsRes['data']['data'][x]['url'];
                            }
                            if (newsRes['data']['data'][x]['id'] === this.newsId) {
                                data = newsRes['data']['data'][x];
                                if (this.notificationData['activity_type'] === 0) {
                                    newsRes['data']['data'][x]['is_notification_news'] = true;
                                }
                            }
                            this.newsData.push(newsRes['data']['data'][x]);
                        }
                        console.log('newss');
                        // this.openNewsDetail(data);
                        this.isNewsPageLoad = true;
                        this.isNewsLoad = false;
                        this.isNewsLoadCount++;
                    } else if (type === 'twitter') {
                        this.twittersSettingsData = Object.assign({}, newsRes['data']);
                        let tweetData = '';
                        for (const x of Object.keys(newsRes['data']['data'])) {
                            if (next === 0) {
                                this.lastView = newsRes['data']['data'][x]['last_view'];
                            }
                            if (this.isLAPP) {
                                if (this.ProductData['favourite']) {
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
                            newsRes['data']['data'][x]['target'] = '_blank';
                            if (newsRes['data']['data'][x]['url'] === '') {
                                newsRes['data']['data'][x]['url'] = 'javascript:void(0)';
                                newsRes['data']['data'][x]['target'] = '';
                            } else if (newsRes['data']['data'][x]['url'].indexOf('http') === -1) {
                                newsRes['data']['data'][x]['url'] = 'http://' + newsRes['data']['data'][x]['url'];
                            }
                            if (newsRes['data']['data'][x]['id'] === this.newsId) {
                                tweetData = newsRes['data']['data'][x];
                                if (this.notificationData['activity_type'] === 0) {
                                    newsRes['data']['data'][x]['is_notification_news'] = true;
                                }
                            }
                            this.twittersData.push(newsRes['data']['data'][x]);
                        }
                       // this.openNewsDetail(tweetData);
                        this.isTweetsLoad = false;
                        this.isTweetsPageLoad = true;
                        this.isNewsLoadCount++;
                    }
                    if (this.isNewsLoadCount === 2 && this.isPageLoad) {
                        this.updateNewsLastView();
                        this.openNewsDetail('data');
                    }
                }
            }).catch((err: any) => {
                console.log(err);
                if (err.status === 0 || err.status === 504) {
                    this.router.navigate([`${environment.appPrefix}`]);
                }
                this.isTweetsLoad = false;
                this.isNewsLoad = false;
                this.isAPIRun = false;
                this.isNewsPageLoad = true;
            });
    }

    /**
    * Get all Trials data by KOLs Id
    */
    getAllTrialsDataByProductId() {
        const postObj = {
            'page': this.currentPage,
        };

        this.drugsService.getAllTrialsDataByProductId(this.productId, postObj)
            .then((trialsRes: any) => {
                this.isAPIRun = false;
                if (trialsRes['success']) {
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
                this.isPageLoad = true;
                this.isTrailsLoad = false;
                if (this.isNewsLoadCount === 2 && this.isPageLoad) {
                    this.updateNewsLastView();
                    this.openNewsDetail('data');
                }
            }).catch((err: any) => {
                console.log(err);
                this.isTrailsLoad = false;
                this.isAPIRun = false;
                this.isPageLoad = true;
            });
    }

    /**
    * Show product name with some specific format
    */
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

    /**
    * Get tooltip caption for bookmark icon on news list
    * @param item
    */
    getTooltipData(item: any) {
        if (item.is_bookmark) {
            return 'Unbookmark';
        } else {
            return 'Bookmark';
        }
    }

    /**
    * changes news read/unread staus when click on it
    * @param item
    */
    changeNewsReadStatus(item: any) {
        item.read_status = 1;
    }

    onResize(event: any) {
        this.infoSectionHeight = this.kolinfo.nativeElement.offsetHeight + 'px';
    }

    onWindowScroll(event: any) {
        event.preventDefault();
        this.infoSectionHeight = this.kolinfo.nativeElement.offsetHeight + 'px';
        const self = this;
        const num = window.scrollY;
        if (num > 100) {
            this.showDetail = false;
        }
        if (num > 120) {
            this.renderer.addClass(document.body, 'stickyheader');
            const q = self.infoSectionHeight;
            $('.mat-tab-header').addClass('infoHeight');
            $('.infoHeight').css('top', q);
        } else if (num < 120) {
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
        if (this.newsType !== '') {
            let next = 0;
            if (this.newsType === 'news') {
                if (this.newsSettingsData !== undefined && this.newsSettingsData !== '') {
                    if (this.newsSettingsData['next'] !== null) {
                        this.isNewsLoad = true;
                        next = this.newsSettingsData['next'];
                    }
                }
            } else if (this.newsType === 'twitter') {
                if (this.twittersSettingsData !== undefined && this.twittersSettingsData !== '') {
                    if (this.twittersSettingsData['next'] !== null) {
                        this.isTweetsLoad = true;
                        next = this.twittersSettingsData['next'];
                    }
                }
            }
            if (next > 0) {
                if (!this.isAPIRun) {
                    this.isAPIRun = true;
                    this.messageService.setHttpLoaderStatus(false);
                    this.getAllNewsDataByProductId(this.newsType, next);
                }
            }
        } else {
            if (this.nextPage) {
                if (!this.isAPIRun) {
                    this.isAPIRun = true;
                    this.isTrailsLoad = true;
                    this.messageService.setHttpLoaderStatus(false);
                    this.getAllTrialsDataByProductId();
                }
            }
        }
    }

    /**
    * Change tabs event and set selected tab data
    */
    changeTabsData(event: string) {
        this.selectedTab = event['index'];
        this.renderer.removeClass(document.body, 'stickyheader');
        $('.mat-tab-header').removeClass('infoHeight');
        $('.mat-tab-header').css('top', '0px');
        if (event['index'] === 0) {
            this.newsType = 'news';
        } else if (event['index'] === 1) {
            this.newsType = 'twitter';
        } else if (event['index'] === 2) {
            this.newsType = '';
        }
        this.gaDrugsTabsClicked(this.selectedTab)
    }

    clickTab() {
        this.messageService.setHttpLoaderStatus(true);
        this.spinner.show();
        setTimeout(() => {
            this.spinner.hide();
            this.messageService.setHttpLoaderStatus(false);
        }, 1200);
    }

    /**
    * Collapsed/Expand product detail view
    */
    ExpandDetailView() {
        this.renderer.removeClass(document.body, 'stickyheader');
        $('.mat-tab-header').removeClass('infoHeight');
        $('.mat-tab-header').css('top', '0px');
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        setTimeout(() => {
            this.showDetail = !this.showDetail;
        }, 100);
    }

    /**
    * Get bookmark hover tootltip data
    * @param item
    */
    getTooltipDataForTrail(item: any) {
        if (item.is_bookmarked) {
            return 'Unbookmark';
        } else {
            return 'Bookmark';
        }
    }

    /**
    * Image slider popup in tweet/news tab for multiple images
    */
    showPopup(item: any) {
        if (item.images.original.length > 1) {

            const activeModal = this.modalService.open(KolEntityImageComponent, { size: 'sm', windowClass: 'tweet-image-popup' });
            activeModal.componentInstance.news_images = item.images.original;
        }
    }

    /**
    * Open trial related news screen by clicking on trials item
    * @param item
    */
    openTrialRelatedNews(item: any) {
        item.product_id = this.productId;
        item.is_notification = false;
        localStorage.setItem('ktrials_data', JSON.stringify(item));
        localStorage.setItem('kselected_tab', <any>this.selectedTab);
        this.router.navigate([`${environment.appPrefix}/drug-trial-related-news`]);
    }

    /**
    * get list of user that is used in web mentions for comment
    */
    getUserListForComment() {
        this.kolsService.getUserListForComment()
            .then((res: any) => {
                console.log(res);
                if (res['success']) {
                    res['data']['data'].filter((item: any) => {
                        this.allUserList.push(item);
                    });
                }
            }).catch((err: any) => {
                console.log(err);
            });
    }

    /**
    * Add/remove news item from bookmark list
    * @param item
    */
    addNewsItemToBookmark(item: any) {
        this.messageService.setHttpLoaderStatus(true);
        if (item.is_bookmark && !this.isBookmarkAPIRun) {
            this.isBookmarkAPIRun = true;
            this.drugsService.removeBookmarkNewsById(item.id)
                .then((res: any) => {
                    if (res['success']) {
                        item.is_bookmark = false;
                        this.utilService.showCustom('Bookmark removed.');
                    } else {
                        this.utilService.showError('Error', res['message']);
                    }
                    this.isBookmarkAPIRun = false;
                }).catch((err: any) => {
                    console.log(err);
                    this.utilService.showError('Error', err['message']);
                    this.isBookmarkAPIRun = false;
                });
        } else {
            if (!this.isBookmarkAPIRun) {
                this.isBookmarkAPIRun = true;
                this.drugsService.addBookmarkNewsById(item.id, this.productId)
                .then((res: any) => {
                    if (res['success']) {
                        item.is_bookmark = true;
                        this.utilService.showCustom('Bookmark added.');
                    } else {
                        this.utilService.showError('Error', res['message']);
                    }
                    this.isBookmarkAPIRun = false;
                }).catch((err: any) => {
                    console.log(err);
                    this.isBookmarkAPIRun = false;
                    this.utilService.showError('Error', err['message']);
                });
            }
        }
    }

    /**
    * add to bookmark trials data
    * @param item
    */
    addTrialsToBookmark(item: any) {
        this.messageService.setHttpLoaderStatus(true);
        if (item.is_bookmarked && !this.isBookmarkAPIRun) {
            this.isBookmarkAPIRun = true;
            this.drugsService.removeBookmarkTrailsById(item.id)
                .then((res: any) => {
                    if (res['success']) {
                        item.is_bookmarked = false;
                        this.utilService.showCustom('Bookmark removed.');
                    } else {
                        this.utilService.showError('Error', res['message']);
                    }
                    this.isBookmarkAPIRun = false;
                }).catch((err: any) => {
                    console.log(err);
                    this.utilService.showError('Error', err['message']);
                    this.isBookmarkAPIRun = false;
                });
        } else {
            if (!this.isBookmarkAPIRun) {
                this.isBookmarkAPIRun = true;
                this.drugsService.addBookmarkTrailsById(item.id, this.productId)
                .then((res: any) => {
                    if (res['success']) {
                        item.is_bookmarked = true;
                        this.utilService.showCustom('Bookmark added.');
                    } else {
                        this.utilService.showError('Error', res['message']);
                    }
                    this.isBookmarkAPIRun = false;
                }).catch((err: any) => {
                    console.log(err);
                    this.utilService.showError('Error', err['message']);
                    this.isBookmarkAPIRun = false;
                });
            }
        }
    }

    /**
    * Update last view of news items
    */
    updateNewsLastView() {
        this.messageService.setHttpLoaderStatus(false);
        this.drugsService.updateNewsLastView(this.productId)
            .then((res: any) => {
                if (res['success']) {
                    console.log(res);
                }
                this.messageService.setHttpLoaderStatus(true);
            }).catch((err: any) => {
                console.log(err);
                this.messageService.setHttpLoaderStatus(true);
            });
    }

    /**
     * Open news detail where notification is coming and open comment and like list for that news
     * @param data
     */
    openNewsDetail(data: any) {
        // if (data !== '') {
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
                                console.log('NEWS DATA', data);
                                // self.messageService.setLikelistOpenStatus(data);
                            }, 2000);
                        } else {
                            document.getElementById(<any>self.newsId).click();
                        }
                    });
                }, 500);
            } else if (this.newsId > 0 && this.notificationData['news_type'] === 2) {
                this.selectedTab = 1;
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
                                console.log('NEWS DATA', data);
                                // self.messageService.setLikelistOpenStatus(data);
                            }, 2000);
                        } else {
                            document.getElementById(<any>self.newsId).click();
                        }
                    });
                }, 500);
            }
        }
    // }

    /**
     * refresh the page after premium/nonpremium drug by user
     */
    changeDataByUser(event: any) {
        console.log(event);
        this.currentPage = 1;
        this.newsSettingsData = '';
        this.newsData = [];
        this.twittersSettingsData = '';
        this.twittersData = [];
        this.trialsSettingsData = '';
        this.trialsData = [];
        this.isNewsPageLoad = false;
        this.isPageLoad = false;
        this.isTweetsPageLoad = false;
        this.getAllTrialsDataByProductId();
        this.getAllNewsDataByProductId('news', 0);
        this.getAllNewsDataByProductId('twitter', 0);
    }

    /**
     * Format the code name data
     * @param name: string
     */
    getCodeName(name: string) {
      if (name !== '' && name !== undefined && name !== null) {
        return name.trim();
      } else {
        return '';
      }
    }

    /*GA bookmark Events Tracking for drugs */
    gaDrugsBookmarks(item: any, news_type: any) {
        EventsData.drugsBookmarkLabel = news_type;
        EventsData.drugsBookmarkAction = localStorage.getItem('header_title');
        console.log(item);
        if (item.is_bookmark === false) {
            this.gaService.emitEvent(EventsData.drugsBookmarkCategory,EventsData.drugsBookmarkAction, EventsData.drugsBookmarkLabel, 10);
        }
        else if(item.is_bookmarked === false){
            this.gaService.emitEvent(EventsData.drugsBookmarkCategory,EventsData.drugsBookmarkAction, EventsData.drugsBookmarkLabel, 10);
        }
    }
  // Google Analytics Tabs clicked event tracking in for drugs
    gaDrugsTabsClicked(selectedTab){
        if(selectedTab === 0){
          EventsData.drugsTabsClickedLabel = 'news';
          this.gaService.emitEvent(EventsData.drugsTabsClickedCategory,EventsData.drugsTabsClickedAction,EventsData.drugsTabsClickedLabel, 10);
        }
        else if(selectedTab === 1){
            EventsData.drugsTabsClickedLabel = 'twitter';
            this.gaService.emitEvent(EventsData.drugsTabsClickedCategory,EventsData.drugsTabsClickedAction,EventsData.drugsTabsClickedLabel, 10);
        }
        else if(selectedTab === 2){
            EventsData.drugsTabsClickedLabel ='trials';
            this.gaService.emitEvent(EventsData.drugsTabsClickedCategory,EventsData.drugsTabsClickedAction,EventsData.drugsTabsClickedLabel, 10);
        }
    }
    // Google Analytics # Visited Links event tracking in for drugs
    gaVisitedLinks(item){
        let selectedTab = Number(this.selectedTab)
        EventsData.drugsLinksClickedLabelItemId = item;
        EventsData.drugsLinksClickedAction = localStorage.getItem('header_title');
        if( selectedTab === 0){
            EventsData.drugsLinksClickedLabelNewsType = 'news'
            this.gaService.emitEvent(EventsData.drugsLinksClickedCategory,EventsData.drugsLinksClickedAction,EventsData.drugsLinksClickedLabelNewsType+"Id"+EventsData.drugsLinksClickedLabelItemId,10);
          }
          else if(selectedTab === 1){
            EventsData.drugsLinksClickedLabelNewsType = 'twitter'
              this.gaService.emitEvent(EventsData.drugsLinksClickedCategory,EventsData.drugsLinksClickedAction,EventsData.drugsLinksClickedLabelNewsType+"Id"+EventsData.drugsLinksClickedLabelItemId, 10);
          }
          else if(selectedTab === 2){
            EventsData.drugsLinksClickedLabelNewsType = 'trials'
              this.gaService.emitEvent(EventsData.drugsLinksClickedCategory,EventsData.drugsLinksClickedAction,EventsData.drugsLinksClickedLabelNewsType+"Id"+EventsData.drugsLinksClickedLabelItemId, 10);
          }
          else{}
    }
}
