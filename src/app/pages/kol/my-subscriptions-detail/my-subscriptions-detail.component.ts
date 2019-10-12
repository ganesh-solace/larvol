import { Component, OnInit, OnDestroy, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PremiumKolPopupComponent } from '../premium-kol-popup/premium-kol-popup.component';
import { PremiumCounterPopupComponent } from '../premium-counter-popup/premium-counter-popup.component';
import { TeamNameExistPopupComponent } from '../team-name-exist-popup/team-name-exist-popup.component';
declare var $: any;

import { Router } from '@angular/router';
import { UserService } from './../../../core/service/user/user.service';
import { environment } from '../../../../environments/environment';
import { MessageService } from './../../../core/service/message/message.service';
import { UtilService } from './../../../core/service/util.service';
import { KolsService } from './../../../core/service/kols/kols.service';

@Component({
    selector: 'app-my-subscriptions-detail',
    templateUrl: './my-subscriptions-detail.component.html',
    styleUrls: ['./my-subscriptions-detail.component.scss']
})
export class MySubscriptionsDetailComponent implements OnInit, OnDestroy {
    @ViewChild('kolInfo') kolinfo: ElementRef;
    backTitle = 'Back to previous page';
    modalReference: any;
    teamDetail: any = [];
    teamHeader: any;
    showData = false;
    kolKeyword: '';
    allKols: any = [];
    searchKolList: any;
    currentPage = 1;
    nextPage = false;
    isLoadMore = false;
    isClicked = false;
    selectedKol: any;
    isEdit = false;
    teamName: any;
    loggedUserData: any;
    headerTitle = '';
    isLoaded = false;
    placeholder: any;
    starTitle = 'Remove Premium';
    isNameEdit = false;
    existingTeamName = '';

    constructor(
        private location: Location,
        private renderer: Renderer2,
        private modalService: NgbModal,
        private userService: UserService,
        private router: Router,
        private messageService: MessageService,
        private utilService: UtilService,
        private kolsService: KolsService,
    ) {
        let teamData = localStorage.getItem('clicked_team');
        teamData = JSON.parse(teamData);
        console.log('teamData', teamData);
        this.getSubscriptionPlanTeamDetail(teamData['id']);

        if (this.headerTitle === '') {
            this.headerTitle = localStorage.getItem('header_title');
        }
        localStorage.setItem('header_title', 'My Subscription');
        this.messageService.setKolsData('My Subscription');
    }

    ngOnInit() {

        this.loggedUserData = this.utilService.getLoggedUserData();
        // this.getAllKolList();
        console.log('this.loggedUserData dcd', this.loggedUserData);
    }

    ngOnDestroy() {
        this.messageService.setKolsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);
        this.renderer.removeClass(document.body, 'stickyheader');
    }

    goBack() {
        // this.location.back();
        this.router.navigate([`${environment.appPrefix}/subscription-list`, { tab: 1 }]);
    }
    /*--- window scroll event---*/
    onResize(event: any) {
        event.preventDefault();
    }


    onWindowScroll(event: any) {
        event.preventDefault();
        const num = window.scrollY;
        const q = this.kolinfo.nativeElement.offsetHeight + 'px';
        if (num > 110) {
            this.renderer.addClass(document.body, 'stickyheader');
            $('.subscription-header').addClass('infoHeight');
            $('infoHeight').css('top', q);
        } else if (num < 110) {
            this.renderer.removeClass(document.body, 'stickyheader');
            $('.subscription-header').removeClass('infoHeight');
            $('.subscription-header').css('top', '0px');
        }
    }

    /*-- premium kol added popup --*/
    PremiumKol() {
        this.modalReference = this.modalService.open(PremiumKolPopupComponent, { windowClass: 'premiumKol-popup' });
        this.modalReference.componentInstance.message = 'KOL is already added as premium.';
        this.modalReference.result.then((result: any) => {
            this.kolKeyword = '';
            this.selectedKol = '';
        }, (reason: any) => {
            console.log(reason);
            this.kolKeyword = '';
            this.selectedKol = '';
        });
    }
    /*-- premium kol added popup --*/

    /*-- premium counter kol popup --*/
    PremiumCounter(subCount) {
        this.modalReference = this.modalService.open(PremiumCounterPopupComponent, { windowClass: 'premiumCounter-popup premiumKol-popup' });
        this.modalReference.componentInstance.count = subCount;
        this.modalReference.componentInstance.entity = 'KOLs';
        this.modalReference.result.then((result: any) => {
            this.kolKeyword = '';
            this.selectedKol = '';
        }, (reason: any) => {
            console.log(reason);
            this.kolKeyword = '';
            this.selectedKol = '';
        });
    }
    /*-- premium counter kol popup --*/

    /**
    * Get team data of subscribed user
    */
    getSubscriptionPlanTeamDetail(id: any) {
        this.userService.getSubscriptionPlanTeamDetail(id)
            .then((res) => {
                console.log('res', res);
                if (res['success']) {
                    this.teamHeader = res['data'];
                    Object.keys(res['data']['kols']['data']).map(key => {
                        const instituteData = [];
                        for (const i of Object.keys(res['data']['kols']['data'][key]['kol_institutions'])) {
                            const data = [];
                            if (res['data']['kols']['data'][key]['kol_institutions'][i]['name'] !== null && res['data']['kols']['data'][key]['kol_institutions'][i]['name'] !== '') {
                                data.push(res['data']['kols']['data'][key]['kol_institutions'][i]['name']);
                            }
                            if (res['data']['kols']['data'][key]['kol_institutions'][i]['city'] !== null && res['data']['kols']['data'][key]['kol_institutions'][i]['city'] !== '') {
                                data.push(res['data']['kols']['data'][key]['kol_institutions'][i]['city']);
                            }
                            if (res['data']['kols']['data'][key]['kol_institutions'][i]['state'] !== null && res['data']['kols']['data'][key]['kol_institutions'][i]['state'] !== '') {
                                data.push(res['data']['kols']['data'][key]['kol_institutions'][i]['state']);
                            }
                            if (res['data']['kols']['data'][key]['kol_institutions'][i]['country'] !== null && res['data']['kols']['data'][key]['kol_institutions'][i]['country'] !== '') {
                                data.push(res['data']['kols']['data'][key]['kol_institutions'][i]['country']);
                            }
                            instituteData.push(data.join(', '));
                        }
                        res['data']['kols']['data'][key]['kolInstitutionsData'] = instituteData;
                        res['data']['kols']['data'][key]['starTitle'] = 'Remove Premium';
                        this.teamDetail.push(res['data']['kols']['data'][key]);
                    });
                    this.existingTeamName = this.teamHeader.description;
                    if (this.teamDetail.length > 0) {
                        this.showData = true;
                    } else {
                        this.showData = false;
                    }
                    console.log('this.teamDetail after', this.teamDetail);
                }
            }).catch((err) => {
                console.log(err);
            });
    }

    /**
    * Open KOLs detail for selected or clicked KOLs
    * @param item
    */
    openKOLsDetail(item: any) {
        // localStorage.setItem('header_title', item['kapp_full_name']);
        this.router.navigate([`${environment.appPrefix}/kol-entity/${btoa(item.kol_id)}`]);
    }

    /**
    * open intitute suto suggestions list and show match institute based on user type
    */
    searchKolFromList(event: any) {
        this.getAllKolList('0');
        console.log('this.ke', this.kolKeyword);
        if (this.kolKeyword.length === 0) {
            this.isClicked = false;
        }
    }

    /**
    * Get all existing institution list without paginations
    */
    getAllKolList(fromWhere) {
        console.log('fromWhere', fromWhere);
        if (fromWhere === '0') {
            this.currentPage = 1;
            this.messageService.setHttpLoaderStatus(true);
            this.isClicked = false;
        } else {
            this.currentPage += 1;
        }

        if (this.kolKeyword !== undefined) {
            if (this.kolKeyword.length >= 3) {
                this.showData = true;
                const postObj = {
                    'page': this.currentPage,
                };
                if (this.kolKeyword !== '') {
                    postObj['query'] = this.kolKeyword;
                }
                this.userService.getAllLAPPKOls(postObj)
                    .then((res: any) => {
                        this.nextPage = res['data']['next_page'];
                        if (this.nextPage && fromWhere === '1') {
                            this.currentPage += 1;
                        }
                        if (fromWhere === '0') {
                            this.allKols = [];
                        }
                        console.log('this.allKols before', this.allKols);
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
                            res['data']['data'][key]['kolInstitutionsData'] = instituteData;
                            this.allKols.push(res['data']['data'][key]);
                        });
                        console.log('this.allKols after', this.allKols);
                        this.isLoadMore = false;
                        this.isClicked = true;
                    }).catch((err: any) => {
                        console.log(err);
                        this.isLoadMore = false;
                    });
            } else {
                if (this.teamDetail.length === 0) {
                    this.showData = false;
                } else {
                    this.showData = true;
                }
            }
        }

    }

    /**
    * Load more search KOls data when scroll down
    * @param event
    */
    onScroll(event: any) {
        console.log('event', event);
        console.log('this.nextPage', this.nextPage);
        console.log('this.isLoadMore', this.isLoadMore);
        if (this.nextPage && !this.isLoadMore) {
            this.messageService.setHttpLoaderStatus(false);
            this.isLoadMore = true;
            this.getAllKolList('1');
        }
    }

    /**
    * Select specific kol from list
    * @param item
    */
    selectKol(item) {
        this.isClicked = false;
        this.kolKeyword = item.kol_full_name;
        this.selectedKol = item;
        console.log('item', item);
    }

    /**
    * Check whether the kol exists in the already premium kol list or not
    */
    checkExistingKol() {
        console.log('this.selectedKol', this.selectedKol);
        console.log('teamDetail', this.teamDetail);
        let isExists = false;
        if (this.selectedKol !== undefined && this.selectedKol !== '') {
            isExists = this.checkKol(this.teamDetail, this.selectedKol.kol_id);
        }
        console.log('isExists', isExists);
        if (isExists) {
            this.PremiumKol();
        } else {
            if (this.selectedKol !== undefined && this.selectedKol !== '') {
                if (this.teamHeader['subscribed'] === this.teamDetail.length) {
                    this.PremiumCounter(this.teamHeader['subscribed']);
                } else {
                    this.selectedKol['favourite'] = true;
                    this.teamDetail.unshift(this.selectedKol);
                    this.kolKeyword = '';
                    this.selectedKol = '';
                }
            }

        }
    }

    checkKol(arr, kolId) {
        const found = arr.some(el => el.kol_id === kolId);
        if (!found) {
            return false;
        } else {
            return true;
        }
    }

    /**
    * Edit the name of team
    */
    editTeamName(name) {
        this.isEdit = true;
        this.teamName = this.teamHeader.description;
    }

    /**
    * Update the team name and prepare the variable for sending it to final save
    */
    updateTeamName() {
        this.isEdit = false;
        this.teamHeader.description = this.teamName.trim();
        this.isNameEdit = true;
    }

    /**
    * Cancel team name change
    */
    cancelTeamName() {
        this.isEdit = false;
    }

    /**
    * Add or Remove Kols as Favourite
    * @param item
    */
    addOrRemoveFavouriteKols(item: any) {
        item.favourite = !item.favourite;
        if (item.favourite) {
            item.starTitle = 'Remove Premium';
        } else {
            item.starTitle = 'Add Premium';
        }
    }

    /**
    * Save the subscription detail
    */
    saveSubdetails() {
        let kolIdArr: any = [];
        const finalObj = {};
        const teamDetailCnt = this.teamDetail.length;
        const nonFavourite = [];
        this.teamDetail.map(x => {
            if (x.favourite) {
                kolIdArr.push(x.kol_id);
            } else {
                nonFavourite.push(x.kol_id);
            }

            if (nonFavourite.length === teamDetailCnt) {
                kolIdArr = 0;
            }

        });
        console.log('kolIdArr', kolIdArr);
        console.log('teamHeader', this.teamHeader);
        let teamData = localStorage.getItem('clicked_team');
        teamData = JSON.parse(teamData);
        if (this.existingTeamName !== this.teamHeader.description) {
            finalObj['name'] = this.teamHeader.description;
        }
        finalObj['kol_id'] = kolIdArr;

        this.userService.addSubscriptionDetail(finalObj, teamData)
            .then((res: any) => {
                console.log('res', res);
                if (res['success']) {
                    this.router.navigate([`${environment.appPrefix}/subscription-list`, { tab: 1 }]);
                } else {
                    console.log(res['message']);
                    if (res['errors']['name'] === 'The name has already been taken.') {
                        this.TeamExist();
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
    }

    /**
    * Cancel the changes
    */
    cancelSubdetails() {
        this.router.navigate([`${environment.appPrefix}/subscription-list`, { tab: 1 }]);
    }

    /*-- team exist popup --*/
    TeamExist() {
        this.modalReference = this.modalService.open(TeamNameExistPopupComponent, { windowClass: 'premiumKol-popup' });
    }
    /*-- team exist popup --*/
}
