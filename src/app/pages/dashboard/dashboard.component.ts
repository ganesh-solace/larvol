import { Component, OnInit, OnDestroy, Renderer2, HostListener, ViewChild, ElementRef } from '@angular/core';
import { HomeService } from './../../core/service/home/home.service';
import { MessageService } from './../../core/service/message/message.service';
import { Router, NavigationEnd } from '@angular/router';
import { UtilService } from './../../core/service/util.service';
import { apiInfo } from './../../../environments/environment';
import 'rxjs/add/operator/filter';
import { environment } from '../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../../core/service/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { last } from 'rxjs/operators';
import { GoogleAnalyticsService } from 'src/app/core/service/google-analytics.service';
import { EventsData } from 'src/app/core/service/gaEventsData';

declare var $: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    @ViewChild('slickModalTrending') slickModalTrending: ElementRef;
    kolsData: any = [];
    currentPage = 1;
    nextPage = false;
    query = '';
    loggedUserData: any;
    userMode: any;
    isLoad = false;
    previousUrl: string;
    isLoadMore = false;
    kolReference: any;
    isApiRun = false;
    ifAPISuccess = false;
    message: any;
    isLAPP = false;
    kolListRef: any;
    isExpired = false;
    remainingDays: any;
    expiredMsg = '';
    isGroupShowId: any;
    showGroupPopup = false;
    teamsGroups: any = [];
    kolTeams: any = [];
    kolGroups: any = [];
    groupForm: FormGroup;
    modalReference: any;
    isShowTabs = true;
    numTeams: any;
    numGroups: any;
    postObj: any = {};
    isSpecificClick = false;
    clickedTab: any = {};
    existsMsg: any = '';
    selectedTab = 'kol';
    selectedTabRef: any;
    navigationSubscription: any;
    isDrugExpired = false;
    drugRemainingDays: any;
    drugExpiredMsg = '';
    isAnalyticShow = false;
    itemDetails:any;
    /**
     * tabbing slider
     */
    slideConfig = {
        enabled: true,
        autoplay: false,
        arrows: true,
        dots: false,
        speed: 500,
        infinite: false,
        centerMode: false,
        draggable: true,
        'slidesToShow': 5,
        'slidesToScroll': 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
        ]
    };

    @HostListener('document:click', ['$event'])
    clickout(event: any) {
        if (event.srcElement.className.indexOf('groupPopup') === -1) {
            if (this.showGroupPopup) {
                this.showGroupPopup = false;
                this.groupForm.reset();
            }
        }
    }

    constructor(
        private homeService: HomeService,
        private messageService: MessageService,
        private router: Router,
        private utilService: UtilService,
        private renderer: Renderer2,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private gaService:GoogleAnalyticsService
    ) {
        this.isLoad = false;
        this.loggedUserData = this.utilService.getLoggedUserData();

        this.userMode = this.loggedUserData['mode'];
        if (this.loggedUserData['organizations'].length === 0) {
            this.isLAPP = true;
        }

        router.events.filter(event => event instanceof NavigationEnd)
            .subscribe(e => {
                this.utilService.previousUrl = this.previousUrl;
                this.previousUrl = e['url'];
            });

        this.navigationSubscription = this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
                if (localStorage.getItem('selectedEntity') !== null && localStorage.getItem('selectedEntity') !== '' && localStorage.getItem('selectedEntity') !== undefined) {
                    this.selectedTab = localStorage.getItem('selectedEntity');
                } else {
                    localStorage.setItem('selectedEntity', 'kol');
                }
                this.changeEntityTab(this.selectedTab);
            }
        });

        this.kolReference = this.messageService.getHideSearchBoxStatus().subscribe(res => {
          console.log('res', res);
            if (res) {
                this.renderer.removeClass(document.body, 'body-overflow');
                this.messageService.setHttpLoaderStatus(true);
                this.messageService.setKolsListEditStatus(true);
                if (!this.ifAPISuccess) {
                    if (localStorage.getItem('selectedEntity') === 'kol') {
                        this.isLoad = false;
                        this.currentPage = 1;
                        this.kolsData = [];
                        this.clickedTab = {};
                        this.isAnalyticShow = false;
                        this.getAllLAPPKolsData(null);
                    }
                }
            }
        });

        this.kolListRef = this.messageService.getLoggedUserData().subscribe(res => {
            this.loggedUserData = this.utilService.getLoggedUserData();
            this.checkUserLoginDetail();
        });

        this.selectedTabRef = this.messageService.getSelectedEntityData().subscribe((res: any) => {
            if (res !== undefined) {
                // this.changeEntityTab(res);
            }
        });

        this.groupForm = this.formBuilder.group({
            groupName: [
                '',
                [
                    Validators.required,
                ]
            ]
        });
    }

    ngOnInit() {
        this.messageService.setHttpLoaderStatus(true);
        localStorage.removeItem('Kselected_KOLs');
        localStorage.removeItem('header_title');
        this.messageService.setKolsData(null);
        // this.clickedTab = {};
        // if (this.userMode === apiInfo.MODE_LTL) {
        //     this.getAllLAPPKolsData(null);
        // } else if (this.userMode === apiInfo.MODE_PULSE) {
        //     this.getAllLAPPKolsData(null);
        // }
        localStorage.removeItem('kAdvanced_search_data');
        localStorage.removeItem('kselected_tab');
        localStorage.removeItem('KsearchAreaId');
        localStorage.removeItem('KsearchAreaData');
        localStorage.removeItem('KsearchInstituteId');
        localStorage.removeItem('KsearchInstituteData');
        localStorage.removeItem('kbookmarkselected_tab');
        this.renderer.removeClass(document.body, 'body-overflow');

        this.showGroupsandTeams();

        console.log(localStorage.getItem('selectedEntity'));
        if (localStorage.getItem('selectedEntity') !== null && localStorage.getItem('selectedEntity') !== '' && localStorage.getItem('selectedEntity') !== undefined) {
            this.selectedTab = localStorage.getItem('selectedEntity');
        } else {
            localStorage.setItem('selectedEntity', 'kol');
        }
        this.messageService.setSelectedEntityData(this.selectedTab);
    }

    ngOnDestroy() {
        if (!!this.kolReference) {
            this.kolReference.unsubscribe();
        }

        if (!!this.kolListRef) {
            this.kolListRef.unsubscribe();
        }

        if (!!this.selectedTabRef) {
            this.selectedTabRef.unsubscribe();
        }

        if (!!this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }

        this.messageService.setHttpLoaderStatus(true);
    }

    /**
    * check login user type and show data based on that
    */
    checkUserLoginDetail() {
        if (this.loggedUserData !== null || this.loggedUserData !== undefined || this.loggedUserData !== '') {
            this.userMode = this.loggedUserData['mode'];
            if (this.loggedUserData['organizations'].length === 0) {
                this.isLAPP = true;
            }
            if (this.isLAPP) {
                // if (this.loggedUserData.remaining_days !== null && this.loggedUserData.remaining_days !== '') {
                this.remainingDays = this.loggedUserData.remaining_days;
                this.drugRemainingDays = this.loggedUserData.drug_remaining_days;
                // }

                /**
                 * Show subscrirption reminder msg for individual user (KOL entity)
                 */
                if (this.remainingDays <= 15) {
                    if (this.loggedUserData.active_subscription_expired !== null && this.loggedUserData.active_subscription_expired !== '') {
                        this.isExpired = true;
                    } else {
                        this.isExpired = false;
                    }
                } else {
                    this.isExpired = false;
                }
                this.expiredMsg = '';

                /**
                 * Show subscrirption reminder msg for individual user (Drug entity)
                 */
                if (this.drugRemainingDays <= 15) {
                    if (this.loggedUserData.drugs_subscription_expired !== null && this.loggedUserData.drugs_subscription_expired !== '') {
                        this.isDrugExpired = true;
                    } else {
                        this.isDrugExpired = false;
                    }
                } else {
                    this.isDrugExpired = false;
                }
                this.drugExpiredMsg = '';
            } else {
                this.isExpired = false;
                let isSet = false;
                this.expiredMsg = '';
                this.isDrugExpired = false;
                this.drugExpiredMsg = '';
                let drugIsSet = false;
                if (this.loggedUserData.teams !== undefined) {
                    for (const x of Object.keys(this.loggedUserData.teams)) {
                        let days = 0;
                        let isExpired = false;
                        let drugDays = 0;
                        let drugIsExpired = false;
                        this.loggedUserData.teams[x]['subscription'].filter((item: any) => {
                            console.log('item[remaining_days]', item['remaining_days']);
                            if (item.subscription_expired_date !== null && item.subscription_expired_date !== '') {
                                if (item['remaining_days'] === null) {
                                    console.log('ccc');
                                    if (item['entity'] === 'KOLs') {
                                        days = null;
                                    }
                                    if (item['entity'] === 'Drugs') {
                                        drugDays = null;
                                    }
                                }
                                if (item['remaining_days'] <= 15) {
                                    if (item['entity'] === 'KOLs') {
                                        days = item['remaining_days'];
                                        isExpired = true;
                                    }
                                    if (item['entity'] === 'Drugs') {
                                        drugDays = item['remaining_days'];
                                        drugIsExpired = true;
                                    }
                                }
                            }
                        });

                        /**
                         * Subscription reminder msg set for Team user (KOL entity)
                         */
                        if (days === null) {
                            isSet = true;
                            if (this.expiredMsg !== '' && this.expiredMsg !== null) {
                                this.expiredMsg = this.expiredMsg + `, team (${this.loggedUserData.teams[x]['name']}) has been expired`;
                            } else {
                                this.expiredMsg = `Your subscription for team (${this.loggedUserData.teams[x]['name']}) has been expired`;
                            }
                        }
                        if (days === 0 && isExpired) {
                            isSet = true;
                            if (this.expiredMsg !== '' && this.expiredMsg !== null) {
                                this.expiredMsg = this.expiredMsg + `, team (${this.loggedUserData.teams[x]['name']}) expires today`;
                            } else {
                                this.expiredMsg = `Your subscription for team (${this.loggedUserData.teams[x]['name']}) expires today`;
                            }
                        }
                        if (days > 0) {
                            isSet = true;
                            let strDays = '';
                            if (days === 1) {
                                strDays = 'day';
                            } else {
                                strDays = 'days';
                            }
                            if (<any>x > 0) {
                                if (this.expiredMsg !== '' && this.expiredMsg !== null) {
                                    this.expiredMsg = this.expiredMsg + `, team (${this.loggedUserData.teams[x]['name']}) expires in ${days}  ` + strDays;
                                } else {
                                    this.expiredMsg = `Your subscription for team (${this.loggedUserData.teams[x]['name']}) expires in ${days}  ` + strDays;
                                }
                            } else {
                                this.expiredMsg = `Your subscription for team (${this.loggedUserData.teams[x]['name']}) expires in ${days} ` + strDays;
                            }
                        } else if (days < 0) {
                            if (isExpired) {
                                isSet = true;
                                if (<any>x > 0) {
                                    if (this.expiredMsg !== '' && this.expiredMsg !== null) {
                                        this.expiredMsg = this.expiredMsg + `, team (${this.loggedUserData.teams[x]['name']}) expires today`;
                                    } else {
                                        this.expiredMsg = `Your subscription for team (${this.loggedUserData.teams[x]['name']}) expires today`;
                                    }
                                } else {
                                    this.expiredMsg = `Your subscription for team (${this.loggedUserData.teams[x]['name']}) expires today`;
                                }
                            }
                        }

                        /**
                         * Subscription reminder msg set for Team user (Drug entity)
                         */
                        if (drugDays === null) {
                            drugIsSet = true;
                            if (this.drugExpiredMsg !== '' && this.drugExpiredMsg !== null) {
                                this.drugExpiredMsg = this.drugExpiredMsg + `, team (${this.loggedUserData.teams[x]['name']}) has been expired`;
                            } else {
                                this.drugExpiredMsg = `Your subscription for team (${this.loggedUserData.teams[x]['name']}) has been expired`;
                            }
                        }
                        if (drugDays === 0 && drugIsExpired) {
                            drugIsSet = true;
                            if (this.drugExpiredMsg !== '' && this.drugExpiredMsg !== null) {
                                this.drugExpiredMsg = this.drugExpiredMsg + `, team (${this.loggedUserData.teams[x]['name']}) expires today`;
                            } else {
                                this.drugExpiredMsg = `Your subscription for team (${this.loggedUserData.teams[x]['name']}) expires today`;
                            }
                        }
                        if (drugDays > 0) {
                            drugIsSet = true;
                            let strDays = '';
                            if (drugDays === 1) {
                                strDays = 'day';
                            } else {
                                strDays = 'days';
                            }
                            if (<any>x > 0) {
                                if (this.drugExpiredMsg !== '' && this.drugExpiredMsg !== null) {
                                    this.drugExpiredMsg = this.drugExpiredMsg + `, team (${this.loggedUserData.teams[x]['name']}) expires in ${drugDays}  ` + strDays;
                                } else {
                                    this.drugExpiredMsg = `Your subscription for team (${this.loggedUserData.teams[x]['name']}) expires in ${drugDays}  ` + strDays;
                                }
                            } else {
                                this.drugExpiredMsg = `Your subscription for team (${this.loggedUserData.teams[x]['name']}) expires in ${drugDays} ` + strDays;
                            }
                        } else if (drugDays < 0) {
                            if (drugIsExpired) {
                                drugIsSet = true;
                                if (<any>x > 0) {
                                    if (this.drugExpiredMsg !== '' && this.drugExpiredMsg !== null) {
                                        this.drugExpiredMsg = this.drugExpiredMsg + `, team (${this.loggedUserData.teams[x]['name']}) expires today`;
                                    } else {
                                        this.drugExpiredMsg = `Your subscription for team (${this.loggedUserData.teams[x]['name']}) expires today`;
                                    }
                                } else {
                                    this.drugExpiredMsg = `Your subscription for team (${this.loggedUserData.teams[x]['name']}) expires today`;
                                }
                            }
                        }
                    }
                    if (!isSet) {
                        this.expiredMsg = '';
                    }
                    if (!drugIsSet) {
                        this.drugExpiredMsg = '';
                    }
                }
            }
        }
    }

    /**
    * Get all kols list form server for Lapp users
    */
    getAllLAPPKolsData(item: any) {
        this.ifAPISuccess = true;
        console.log('item is clicked', item);
        if (item) {
            if (item !== 'scroll') {
                this.currentPage = 1;
                this.kolsData = [];
            }
        } else {
            this.clickedTab['id'] = 0;
        }
        this.postObj = {
            'page': this.currentPage,
            'favourite': true
        };

        console.log('item', item);
        console.log('item', this.clickedTab);

        if (item) {
            if (item.type !== 'all' && item !== 'scroll') {
                this.postObj['type'] = item.type;
                this.postObj['id'] = item.id;
                this.isSpecificClick = true;
            } else {
                if (item === 'scroll') {
                    this.postObj['type'] = this.clickedTab['type'];
                    this.postObj['id'] = this.clickedTab['id'];
                }
                this.isSpecificClick = false;
            }
        }

        if (this.query !== '') {
            this.postObj['query'] = this.query;
        }
        if (this.currentPage === 1) {
            this.isLoad = false;
        }
        this.homeService.getAllLAPPKOls(this.postObj)
            .then(res => {
                if (res['success']) {
                    this.nextPage = res['data']['next_page'];
                    Object.keys(res['data']['data']).map(key => {
                        const instituteData = [];
                        for (const i of Object.keys(res['data']['data'][key]['kol_institutions'])) {
                            const data = [];
                            if (res['data']['data'][key]['kol_institutions'][i]['name'] !== null && res['data']['data'][key]['kol_institutions'][i]['name'] !== '') {
                                data.push(res['data']['data'][key]['kol_institutions'][i]['name']);
                            }
                            if (res['data']['data'][key]['kol_institutions'][i]['city'] !== null && res['data']['data'][key]['kol_institutions'][i]['city'] !== '') {
                                data.push(res['data']['data'][key]['kol_institutions'][i]['city']);
                            }
                            if (res['data']['data'][key]['kol_institutions'][i]['state'] !== null && res['data']['data'][key]['kol_institutions'][i]['state'] !== '') {
                                data.push(res['data']['data'][key]['kol_institutions'][i]['state']);
                            }
                            if (res['data']['data'][key]['kol_institutions'][i]['country'] !== null && res['data']['data'][key]['kol_institutions'][i]['country'] !== '') {
                                data.push(res['data']['data'][key]['kol_institutions'][i]['country']);
                            }
                            instituteData.push(data.join(', '));
                        }
                        res['data']['data'][key]['institutionsData'] = instituteData;
                        this.kolsData.push(res['data']['data'][key]);
                    });
                    if (res['data']['next_page']) {
                        this.currentPage += 1;
                    }
                    if (item && this.kolsData.length > 0) {
                        this.isSpecificClick = false;
                    }
                    this.isLoad = true;
                    this.isLoadMore = false;
                    this.isApiRun = false;
                } else {
                    this.isApiRun = false;
                }
                this.ifAPISuccess = false;
            }).catch(err => {
                console.log(err);
                this.isLoad = true;
                this.isApiRun = false;
                this.ifAPISuccess = false;
            });
    }

    /**
    * Load more data with scroll down
    * @param event
    */
    onScroll(event: any) {
        console.log(event);
        console.log(this.clickedTab);
        if (this.nextPage) {
            if (!this.isLoadMore) {
                this.isLoadMore = true;
                this.isApiRun = true;
                this.messageService.setHttpLoaderStatus(false);
                if (this.userMode === apiInfo.MODE_LTL) {
                    if (this.clickedTab['id'] > 0) {
                        this.getAllLAPPKolsData('scroll');
                    } else {
                        this.getAllLAPPKolsData(null);
                    }
                } else if (this.userMode === apiInfo.MODE_PULSE) {
                    if (this.clickedTab['id'] > 0) {
                        this.getAllLAPPKolsData('scroll');
                    } else {
                        this.getAllLAPPKolsData(null);
                    }
                }
            }
        }
    }

    /**
    * Open KOLs detail for selected or clicked KOLs
    * @param item
    */
    openKOLsDetail(item: any) {
        console.log(item);
        localStorage.setItem('header_title', item['kol_full_name']);
        this.router.navigate([`${environment.appPrefix}/kol-entity/${btoa(item.kol_id)}`]);
    }

    /**
    * check image is exist or not if not than create placehoolder image with kol firstname and lastname
    * @param item
    */
    checkImageExistorNot(item: any) {
        item['kol_image_url'] = '';
        const _name = item.kol_full_name;
        if (_name !== null && _name !== undefined) {
            if (item.kol_first_name !== null) {
                item['kol_short_name'] = `${item.kol_first_name.split(' ')[0][0]}`;
            }
            if (item.kol_last_name !== null) {
                item['kol_short_name'] = item['kol_short_name'] + `${item.kol_last_name.split(' ')[0][0]}`;
            }
        }
    }

    imageLoadSuccess(item: any) {
        item['imageLoad'] = true;
    }

    /**
    * Open the popup for group
    */
    openGroup(item,itemDetails) {
        console.log('item', item);
        this.isGroupShowId = item;
        this.itemDetails = itemDetails;
        this.existsMsg = '';
        this.homeService.getGroupsandTeamsByKolId(item)
            .then(res => {
                if (res['success']) {
                    console.log('res of kol id', res);
                    if (res['data']['teams']) {
                        this.kolTeams = res['data']['teams'];
                    } else {
                        this.kolTeams = [];
                    }

                    if (res['data']['groups']) {
                        this.kolGroups = res['data']['groups'];
                    } else {
                        this.kolGroups = [];
                    }
                    this.showGroupPopup = true;
                }
            }).catch(err => {
                console.log(err);
                this.utilService.showError('Error', 'Something went wrong.');
            });
    }

    /**
    * show groups and teams of logged in user
    */
    showGroupsandTeams() {
        this.teamsGroups = [];
        this.homeService.getGroupsandTeams()
            .then(res => {
                if (res['success']) {
                    console.log('res group', res);

                    this.numTeams = res['data'].reduce(function (n, person) {
                        return n + (person.type === 'team');
                    }, 0);

                    this.numGroups = res['data'].reduce(function (n, person) {
                        return n + (person.type === 'group');
                    }, 0);

                    console.log('numTeams', this.numTeams);
                    console.log('numGroups', this.numGroups);

                    if (this.numGroups > 0 && this.numTeams > 1) {
                        this.isShowTabs = true;
                    } else if (this.numGroups > 0 && this.numTeams <= 1) {
                        this.isShowTabs = true;
                    } else if (this.numGroups <= 0 && this.numTeams <= 1) {
                        // this.isShowTabs = false;
                    } else if (this.numGroups <= 0 && this.numTeams > 1) {
                        this.isShowTabs = true;
                    }

                    const firstObj = {
                        'id': 0,
                        'name': 'All KOLs',
                        'type': 'all'
                    };
                    for (let i = 0; i < res['data'].length; i++) {
                        this.teamsGroups.push({
                            'id': res['data'][i].id,
                            'name': res['data'][i].name,
                            'type': res['data'][i].type
                        });
                    }
                    // this.teamsGroups.push(res['data']);
                    this.teamsGroups.unshift(firstObj);
                    const lastObj = {
                      'id': -1,
                      'name': 'KOL Analytics',
                      'type': 'analytics'
                  };
                  this.teamsGroups.push(lastObj);

                    if (this.numTeams <= 1) {
                        this.teamsGroups = this.teamsGroups.filter(function (obj) {
                            return obj.type !== 'team';
                        });
                    }


                    console.log('this.teamsGroups', this.teamsGroups);
                }
            }).catch(err => {
                console.log(err);
            });
    }

    /**
    * Add or remove KOl from the group.
    */
    addRemoveKolFromGroup(item, event) {
        console.log('item', item);
        console.log('event', event.target.checked);

        const postObj = {};
        postObj['kol_id'] = this.isGroupShowId;
        postObj['group_id'] = item.id;
        if (event.target.checked) {
            postObj['action'] = 'add';
        } else {
            postObj['action'] = 'remove';
        }

        this.homeService.addRemoveKolInGroup(postObj)
            .then(res => {
                if (res['success']) {
                    console.log('res group', res);
                    this.utilService.showSuccess('Success', res['message']);
                } else {
                    this.utilService.showError('Error', res['errors']['name']);
                }
            }).catch(err => {
                console.log(err);
                this.utilService.showError('Error', err['errors']['name']);
            });

    }

    /**
    * Add group function
    */

    addGroup() {
        if (this.groupForm.valid) {
            console.log(this.groupForm.controls.groupName.value);
            const postObj = {};
            postObj['name'] = this.groupForm.controls.groupName.value;

            this.userService.addGroup(postObj)
                .then(res => {
                    if (res['success']) {
                        console.log('res', res);
                        this.utilService.showSuccess('Success', res['message']);
                        this.openGroup(this.isGroupShowId,this.itemDetails);
                        this.showGroupsandTeams();
                        this.groupForm.reset();
                    } else {
                        if (res['message'] === 'Name exist') {
                            this.existsMsg = 'Name exists';
                        } else {
                            this.utilService.showError('Error', res['message']);
                        }

                    }
                }).catch(err => {
                    this.groupForm.reset();
                    // this.errorMsg = 'Something went wrong. Please try again later';
                    console.log(err);
                });
        }
    }

    /**
    * Get specific kol list based on group or team
    */
    getSpecificKOlList(item: any) {
        this.clickedTab = item;
        if (item.id > -1 ) {
          this.isAnalyticShow = false;
          this.messageService.setHttpLoaderStatus(true);
          this.getAllLAPPKolsData(this.clickedTab);
        } else {
          this.isAnalyticShow = true;
        }
    }

    resetMsgonKey() {
        if (!this.groupForm.valid) {
            this.existsMsg = '';
        }
    }

    /**
    * Changes tab contain based on selected tab
    * @param tab
    */
    changeEntityTab(tab: any) {
        this.selectedTab = tab;
        // console.log(this.isSpecificClick);
        localStorage.setItem('selectedEntity', tab);
        if (this.selectedTab === 'kol') {
            // if (this.isSpecificClick) {
                this.isSpecificClick = false;
                this.isLoad = false;
                this.currentPage = 1;
                this.kolsData = [];
                this.clickedTab = {};
                this.isAnalyticShow = false;
                this.getAllLAPPKolsData(null);
                $('#slickModal').click();
            // }
        }
        this.messageService.setSelectedEntityData(this.selectedTab);
    }

    /**
     * refresh the page after premium/nonpremium kol by user
     */
    changeDataByUser(event: any) {
        console.log(event);
        if (event.index !== undefined) {
            this.kolsData.splice(event.index, 1);
        }
    }

    /**
     * show kol analytics data based on KOL
     * @memberof DashboardComponent
     */
    showKolAnalytics() {

    }

    // Google Analytics Events Tracking 
    gaKOLClicksTracking() { 
        this.gaService.emitEvent(EventsData.kolsButtonCategory, EventsData.kolsButtonAction ,EventsData.kolsButtonLabel, 10);
    }
    gaDrugsClicksTracking() {
        this.gaService.emitEvent(EventsData.drugsButtonCategory,EventsData.drugsButtonAction ,EventsData.drugsButtonLabel , 10);
    }
    gaKolAnalysisTracking(item) {
        if (item.id === -1) {
            this.gaService.emitEvent(EventsData.kolsAnalyticsButtonCategory,EventsData.kolsAnalyticsButtonAction,EventsData.kolsAnalyticsButtonLabel , 10);
        }
        else { }
    }
    gaGroupTrack(item, event) {
        let userName;
        EventsData.kolsGroupKolNameLabel = this.itemDetails.kol_full_name;
        userName = this.loggedUserData['full_name'];
        if (event.target.checked === false) { }
        else {
            if (event.target.checked) {
                this.gaService.emitEvent(EventsData.kolsGroupCategory,EventsData.kolsGroupNameAction+item.name +EventsData.kolsGroupAddedByAction+ userName,EventsData.kolsGroupKolNameLabel, 10);
            } else {
                this.gaService.emitEvent(EventsData.kolsGroupCategory,EventsData.kolsGroupNameAction+ item.groupName +EventsData.kolsGroupCreatedByAction+ userName,EventsData.kolsGroupCreatedNewGroupLabel, 10);
            }
        }
    }
}
