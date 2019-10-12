import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MessageService } from './../../../core/service/message/message.service';
import { DrugsService } from './../../../core/service/drugs/drugs.service';
import { GoogleAnalyticsService } from 'src/app/core/service/google-analytics.service';
import { EventsData } from 'src/app/core/service/gaEventsData';

@Component({
    selector: 'app-drug-search-list',
    templateUrl: './drug-search-list.component.html',
    styleUrls: ['./drug-search-list.component.scss']
})
export class DrugSearchListComponent implements OnInit, OnDestroy {

    @Input() searchText: any;
    showData = false;
    productsData: any = [];
    isRecentLoad = false;
    recentSearchData: any = [];
    isLoad = false;
    currentPage = 1;
    searchReference: any;
    searchStartReference: any;
    searchIconReference: any;
    isClick = false;

    constructor(
        private location: Location,
        private router: Router,
        private messageService: MessageService,
        private drugsService: DrugsService,
        private gaService:GoogleAnalyticsService
    ) {
        this.searchReference = this.messageService.getKolsSearchText().subscribe(res => {
            this.searchText = res;
            this.showData = true;
            this.isLoad = true;
            if (this.searchText.length >= 3) {
                this.getSearchProductList();
            } else {
                this.isLoad = false;
                this.productsData = [];
            }

            if (this.searchText.length === 0) {
                this.showData = false;
                this.isLoad = false;
            }
        });

        this.searchStartReference = this.messageService.getKolsSearchTextIsStart().subscribe(res => {
            this.searchText = res;
            this.showData = true;
            this.isLoad = true;

            if (this.searchText.length === 0) {
                this.showData = false;
                this.isLoad = false;
            }
        });

        this.searchIconReference = this.messageService.getKolsSearchIconClick().subscribe((res: any) => {
            console.log('response');
            console.log(this.searchText);
            this.openSearchResultPage();
        });
    }

    ngOnInit() {
        if (this.router.url === environment.appPrefix) {
            localStorage.removeItem('ksearch_text');
        }
        console.log(this.searchText);
        if (this.searchText !== undefined) {
            if (this.searchText.length >= 3) {
                this.showData = true;
                this.getSearchProductList();
            }
        } else {
            this.productsData = [];
        }
        this.getAllRecentSearchData();
    }

    ngOnDestroy() {
        if (this.router.url === environment.appPrefix) {
            this.messageService.setHideSearchBoxStatus(true);
        }
        if (!!this.searchReference) {
            this.searchReference.unsubscribe();
        }

        if (!!this.searchStartReference) {
            this.searchStartReference.unsubscribe();
        }

        if (!!this.searchIconReference) {
            this.searchIconReference.unsubscribe();
        }
    }

    /**
    * Get all existing recent search data
    */
    getAllRecentSearchData() {
        this.isRecentLoad = true;
        this.messageService.setHttpLoaderStatus(false);
        this.drugsService.getRecentSearchData()
            .then((res: any) => {
                console.log(res);
                this.isRecentLoad = false;
                // if (res['success']) {
                this.recentSearchData = res['data'];
                // }
            }).catch((err: any) => {
                this.isRecentLoad = false;
                console.log(err);
            });
    }

    /**
    * Get all KOL list based on search keyword
    */
    getSearchProductList() {
        this.productsData = [];
        this.isLoad = true;
        this.messageService.setHttpLoaderStatus(false);
        const postObj = {
            'page': this.currentPage,
            'suggestion': true,
        };

        if (this.searchText !== '') {
            postObj['query'] = this.searchText;
        }
        this.drugsService.getSearchProductList(postObj)
            .then(res => {
                console.log(res);
                if (res['success']) {
                    Object.keys(res['data']['data']).map(key => {
                        const instituteData = [];
                        for (const i of Object.keys(res['data']['data'][key]['product_institutions'])) {
                            if (res['data']['data'][key]['product_institutions'][i]['name'] !== null && res['data']['data'][key]['product_institutions'][i]['name'] !== '') {
                                instituteData.push(res['data']['data'][key]['product_institutions'][i]['name']);
                            }
                        }
                        res['data']['data'][key]['institutions_list'] = instituteData.join(', ');
                    });
                    this.productsData = res['data']['data'];
                    if (res['data']['next_page']) {
                        this.currentPage += 1;
                    }
                    console.log(this.productsData);
                }
                this.isLoad = false;
            }).catch(err => {
                console.log(err);
                this.isLoad = false;
            });
    }

    /**
    * Show all result for search keyword
    */
    openSearchResultPage() {
        if (this.searchText.length >= 3) {
            this.saveRecentSearchData(this.searchText);
            localStorage.setItem('ksearch_text', this.searchText);
            this.messageService.setShowSearchFlag(false);
            this.messageService.setHttpLoaderStatus(true);
            this.router.navigate([`${environment.appPrefix}/drug-search-result`]);
        }
    }

    /**
    * save recent search data on server
    */
    saveRecentSearchData(text: any) {
        this.messageService.setHttpLoaderStatus(false);
        const postObj = {};

        if (text > 0) {
            postObj['product_id'] = text;
        } else {
            postObj['text'] = text;
        }

        this.drugsService.saveRecentSearchData(postObj)
            .then((res: any) => {
                this.messageService.setHttpLoaderStatus(true);
                console.log(res);
                if (res['success']) {

                }
            }).catch((err: any) => {
                this.messageService.setHttpLoaderStatus(true);
            });
    }

    /**
    * Clear all recent search data from localstorage
    */
    clearAllRecentData() {
        this.drugsService.deleteRecentSearchData()
            .then((res: any) => {
                console.log(res);
                if (res['success']) {
                    this.recentSearchData = [];
                }
            }).catch((err: any) => {
                console.log(err);
            });
    }

    /**
    * Open Product detail for selected or clicked product
    * @param item
    */
    openProductDetail(item: any) {
        if (!!this.searchReference) {
            this.searchReference.unsubscribe();
        }
        this.saveRecentSearchData(item.id);
        this.messageService.setShowSearchFlag(false);
        this.messageService.setHttpLoaderStatus(true);
        this.router.navigate([`${environment.appPrefix}/drug-entity/${btoa(item.id)}`]);
    }

    /**
    * Open KOl list or KOl detail page click on recent search data
    * @param item
    */
    openRecentSearchProduct(item: any) {
        if (item.product_id !== null && item.product_id !== '') {
            if (!!this.searchReference) {
                this.searchReference.unsubscribe();
            }
            this.saveRecentSearchData(item.product_id);
            this.messageService.setShowSearchFlag(false);
            this.messageService.setHttpLoaderStatus(true);
            localStorage.setItem('isRecentSearch', 'true');
            this.router.navigate([`${environment.appPrefix}/drug-entity/${btoa(item.product_id)}`]);
        } else {
            localStorage.setItem('ksearch_text', item.search_text);
            this.saveRecentSearchData(item.search_text);
            this.messageService.setShowSearchFlag(false);
            this.messageService.setHttpLoaderStatus(true);
            this.router.navigate([`${environment.appPrefix}/drug-search-result`]);
        }
    }

    clickSearchPage() {
        this.isClick = true;
    }

    closePage() {
        if (this.isClick) {
            this.isClick = false;
        } else {
            if (!!this.searchReference) {
                this.searchReference.unsubscribe();
            }
            localStorage.setItem('ksearch_text', this.searchText);
            this.messageService.setShowSearchFlag(false);
            this.messageService.setHttpLoaderStatus(true);
        }
    }

    goBack() {
        this.location.back();
    }

    /**
     * Redirect on drug request screen
     */
    openDrugRequestPage() {
        this.closePage();
        this.router.navigate([`${environment.appPrefix}/drug-request`]);
    }
    /*GA Search Event Tracking for drugs */
    searchTermGoogleAnalytics(selectedDrug){      
        let selectedEntity
        EventsData.drugsSearchAction = selectedDrug;
        EventsData.drugsSearchLabel = this.searchText
        selectedEntity = localStorage.getItem('selectedEntity');
        if (selectedEntity === 'drug'){
            if( EventsData.drugsSearchLabel === ""){
                EventsData.drugsSearchLabel ="From Recent Search"
            }
            this.gaService.emitEvent(EventsData.drugsSearchCategory,EventsData.drugsSearchAction, EventsData.drugsSearchLabel,10);
        } else {
        }
    }

}
