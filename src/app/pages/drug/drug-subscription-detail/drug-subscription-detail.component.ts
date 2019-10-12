import { Component, OnInit, ElementRef, ViewChild, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './../../../../environments/environment';
import { MessageService } from './../../../core/service/message/message.service';
import { UserService } from './../../../core/service/user/user.service';
import { UtilService } from './../../../core/service/util.service';
import { DrugsService } from './../../../core/service/drugs/drugs.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PremiumKolPopupComponent } from './../../kol/premium-kol-popup/premium-kol-popup.component';
import { PremiumCounterPopupComponent } from './../../kol/premium-counter-popup/premium-counter-popup.component';
import { TeamNameExistPopupComponent } from './../../kol/team-name-exist-popup/team-name-exist-popup.component';

declare var $: any;

@Component({
    selector: 'app-drug-subscription-detail',
    templateUrl: './drug-subscription-detail.component.html',
    styleUrls: ['./drug-subscription-detail.component.scss']
})
export class DrugSubscriptionDetailComponent implements OnInit, OnDestroy {

    @ViewChild('kolInfo') kolinfo: ElementRef;
    backTitle = 'Back to previous page';
    headerTitle = '';
    teamHeader: any;
    teamDetail: any = [];
    existingTeamName = '';
    showData = false;
    isEdit = false;
    loggedUserData: any;
    isNameEdit = false;
    starTitle = 'Remove Premium';
    teamName: any;
    drugKeyword: any = '';
    isClicked = false;
    currentPage = 1;
    nextPage = false;
    isLoadMore = false;
    productsData: any = [];
    selectedDrug: any;
    modalReference: any;

    constructor(
        private router: Router,
        private messageService: MessageService,
        private userService: UserService,
        private utilService: UtilService,
        private renderer: Renderer2,
        private drugsService: DrugsService,
        private modalService: NgbModal,
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

    /**
    * Get team data of subscribed user
    */
    getSubscriptionPlanTeamDetail(id: any) {
        this.userService.getSubscriptionPlanTeamDetailForDrug(id)
            .then((res) => {
                console.log('res', res);
                if (res['success']) {
                    this.teamHeader = res['data'];
                    Object.keys(res['data']['products']['data']).map(key => {
                        const instituteData = [];
                        for (const i of Object.keys(res['data']['products']['data'][key]['product_institutions'])) {
                            if (res['data']['products']['data'][key]['product_institutions'][i]['name'] !== null && res['data']['products']['data'][key]['product_institutions'][i]['name'] !== '') {
                                instituteData.push(res['data']['products']['data'][key]['product_institutions'][i]['name']);
                            }
                        }
                        res['data']['products']['data'][key]['institutions_list'] = instituteData.join(', ');
                        res['data']['products']['data'][key]['starTitle'] = 'Remove Premium';
                        this.teamDetail.push(res['data']['products']['data'][key]);
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
    * Add or Remove Kols as Favourite
    * @param item
    */
    addOrRemoveFavouriteDrugs(item: any) {
        item.favourite = !item.favourite;
        if (item.favourite) {
            item.starTitle = 'Remove Premium';
        } else {
            item.starTitle = 'Add Premium';
        }
    }

    /**
    * Open products detail screen
    * @param item
    */
    openProductDetail(item: any) {
        console.log(item);
        localStorage.setItem('header_title', item['name']);
        this.router.navigate([`${environment.appPrefix}/drug-entity/${btoa(item.id)}`]);
    }

    /**
    * Edit the name of team
    */
    editTeamName(name: string) {
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
    * open intitute suto suggestions list and show match institute based on user type
    */
    searchDrugFromList(event: any) {
        console.log('this.ke', this.drugKeyword);
        if (this.drugKeyword.length === 0) {
            this.isClicked = false;
        }
        this.getAllProductsList('0');
    }


    /**
    * Get all premium products/drugs list from api and showing on landing page
    */
    getAllProductsList(fromWhere: any) {
        if (fromWhere === '0') {
            this.currentPage = 1;
            this.messageService.setHttpLoaderStatus(true);
            this.isClicked = false;
        }

        if (this.drugKeyword !== undefined) {
            if (this.drugKeyword.length >= 3) {
                this.showData = true;
                const postObj = {
                    'page': this.currentPage,
                };

                if (this.drugKeyword !== '') {
                    postObj['query'] = this.drugKeyword;
                }
                this.drugsService.getAllProductsList(postObj)
                    .then((res: any) => {
                        console.log(res);
                        if (res['success']) {
                            this.nextPage = res['data']['next_page'];
                            if (this.nextPage) {
                                this.currentPage += 1;
                            }
                            if (fromWhere === '0') {
                                this.productsData = [];
                            }
                            Object.keys(res['data']['data']).map(key => {
                                const instituteData = [];
                                for (const i of Object.keys(res['data']['data'][key]['product_institutions'])) {
                                    if (res['data']['data'][key]['product_institutions'][i]['name'] !== null && res['data']['data'][key]['product_institutions'][i]['name'] !== '') {
                                        instituteData.push(res['data']['data'][key]['product_institutions'][i]['name']);
                                    }
                                }
                                res['data']['data'][key]['institutions_list'] = instituteData.join(', ');
                                this.productsData.push(res['data']['data'][key]);
                            });
                            this.isLoadMore = false;
                            this.isClicked = true;
                        } else {
                            this.isLoadMore = false;
                        }
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
        if (this.nextPage && !this.isLoadMore) {
            this.messageService.setHttpLoaderStatus(false);
            this.isLoadMore = true;
            this.getAllProductsList('1');
        }
    }

    /**
    * Select specific drug from list
    * @param item
    */
    selectDrug(item: any) {
        this.isClicked = false;
        this.drugKeyword = item.name;
        this.selectedDrug = item;
        console.log('item', item);
    }

    /**
    * Check whether the Drug exists in the already premium kol list or not
    */
    checkExistingDrug() {
        console.log('this.selectedKol', this.selectedDrug);
        console.log('teamDetail', this.teamDetail);
        let isExists = false;
        if (this.selectedDrug !== undefined && this.selectedDrug !== '') {
            isExists = this.checkDrug(this.teamDetail, this.selectedDrug.id);
        }
        console.log('isExists', isExists);
        if (isExists) {
            this.PremiumDrug();
        } else {
            if (this.selectedDrug !== undefined && this.selectedDrug !== '') {
                if (this.teamHeader['subscribed'] === this.teamDetail.length) {
                    this.PremiumCounter(this.teamHeader['subscribed']);
                } else {
                    this.selectedDrug['favourite'] = true;
                    this.teamDetail.unshift(this.selectedDrug);
                    this.drugKeyword = '';
                    this.selectedDrug = '';
                }
            }
        }
    }

    /**
     * Check selected drug is exist or not
     * @param arr
     * @param drugId
     */
    checkDrug(arr: any, drugId: any) {
        const found = arr.some((el: any) => el.id === drugId);
        if (!found) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Show already added premium drug popup
     */
    PremiumDrug() {
        this.modalReference = this.modalService.open(PremiumKolPopupComponent, { windowClass: 'premiumKol-popup' });
        this.modalReference.componentInstance.message = 'Drug is already added as premium.';
        this.modalReference.result.then((result: any) => {
            this.drugKeyword = '';
            this.selectedDrug = '';
        }, (reason: any) => {
            console.log(reason);
            this.drugKeyword = '';
            this.selectedDrug = '';
        });
    }

    /**
     * Show alter popup once user reached limit to add drug as premium list
     * @param subCount
     */
    PremiumCounter(subCount: any) {
        this.modalReference = this.modalService.open(PremiumCounterPopupComponent, { windowClass: 'premiumCounter-popup premiumKol-popup' });
        this.modalReference.componentInstance.count = subCount;
        this.modalReference.componentInstance.entity = 'drugs';
        this.modalReference.result.then((result: any) => {
            this.drugKeyword = '';
            this.selectedDrug = '';
        }, (reason: any) => {
            console.log(reason);
            this.drugKeyword = '';
            this.selectedDrug = '';
        });
    }
    

    /**
    * Cancel the changes
    */
    cancelSubdetails() {
        this.router.navigate([`${environment.appPrefix}/subscription-list`, { tab: 1 }]);
    }

    /**
     * Save updated premium drug list and updated team name by super user
     */
    saveSubdetails() {
        let productIdArr: any = [];
        const finalObj = {};
        const teamDetailCnt = this.teamDetail.length;
        const nonFavourite = [];
        this.teamDetail.map((x: any) => {
            if (x.favourite) {
                productIdArr.push(x.id);
            } else {
                nonFavourite.push(x.id);
            }

            if (nonFavourite.length === teamDetailCnt) {
                productIdArr = 0;
            }

        });
        let teamData = localStorage.getItem('clicked_team');
        teamData = JSON.parse(teamData);
        if (this.existingTeamName !== this.teamHeader.description) {
            finalObj['name'] = this.teamHeader.description;
        }
        finalObj['product_id'] = productIdArr;
        console.log(finalObj);
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

    /*-- team exist popup --*/
    TeamExist() {
        this.modalReference = this.modalService.open(TeamNameExistPopupComponent, { windowClass: 'premiumKol-popup' });
    }
    /*-- team exist popup --*/
}
