import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { MessageService } from './../../../core/service/message/message.service';
import { DrugsService } from './../../../core/service/drugs/drugs.service';
import { Router } from '@angular/router';
import { environment } from './../../../../environments/environment';

@Component({
    selector: 'app-drug-search-result-list',
    templateUrl: './drug-search-result-list.component.html',
    styleUrls: ['./drug-search-result-list.component.scss']
})
export class DrugSearchResultListComponent implements OnInit, OnDestroy {

    searchText: any;
    searchReference: any;
    productsData: any = [];
    currentPage = 1;
    isPageLoad = false;
    isSearchApi = false;
    nextPage = false;
    isLoadMore = false;

    constructor(
        private location: Location,
        private messageService: MessageService,
        private drugsService: DrugsService,
        private router: Router
    ) {
        this.searchText = localStorage.getItem('ksearch_text');
        this.messageService.setShowSearchFlag(false);

        this.searchReference = this.messageService.getShowSearchFlag().subscribe(res => {
            if (this.router.url !== environment.appPrefix) {
                this.searchText = localStorage.getItem('ksearch_text');
                if (this.searchText !== '' && this.searchText !== null && this.searchText !== undefined) {
                    this.productsData = [];
                    this.currentPage = 1;
                    this.isPageLoad = false;
                    this.getSearchProductList();
                } else {
                    localStorage.setItem('selectedEntity', 'drug');
                    this.router.navigate(['/home']);
                }
            }
        });
    }

    ngOnInit() {
        localStorage.removeItem('header_title');
        this.messageService.setKolsData(null);
        this.isPageLoad = false;
        this.messageService.setHttpLoaderStatus(true);

        if (this.searchText !== null && this.searchText !== '') {
            this.currentPage = 1;
            this.messageService.setHttpLoaderStatus(true);
            this.getSearchProductList();
        } else {
            this.router.navigate(['']);
        }
    }

    ngOnDestroy() {
        if (!!this.searchReference) {
            this.searchReference.unsubscribe();
        }
    }

    /**
    * Get all Product list based on search keyword
    */
    getSearchProductList() {
        this.isSearchApi = false;
        const postObj = {
            'page': this.currentPage,
        };

        if (this.currentPage === 1) {
            this.isPageLoad = false;
            this.messageService.setHttpLoaderStatus(true);
        }

        if (this.searchText !== '') {
            postObj['query'] = this.searchText;
        }

        this.drugsService.getSearchProductList(postObj)
            .then(res => {
                if (res['success']) {
                    this.nextPage = res['data']['next_page'];
                    if (this.nextPage) {
                        this.currentPage += 1;
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
                    this.isPageLoad = true;
                    this.isSearchApi = true;
                }
                this.isLoadMore = false;
            }).catch(err => {
                console.log(err);
                this.isLoadMore = false;
                this.isPageLoad = true;
                this.isSearchApi = true;
            });
    }

    /**
    * Open Product detail for selected or clicked Product
    * @param item
    */
    openProductDetail(item: any) {
        this.saveRecentSearchData(item.id);
        this.router.navigate([`${environment.appPrefix}/drug-entity/${btoa(item.id)}`]);
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
                if (res['success']) {

                }
            }).catch((err: any) => {
                this.messageService.setHttpLoaderStatus(true);
            });
    }

    /**
    * Load more search KOls data when scroll down
    * @param event
    */
    onScroll(event: any) {
        console.log(event);
        if (this.nextPage && !this.isLoadMore) {
            this.messageService.setHttpLoaderStatus(false);
            this.isLoadMore = true;
            if (this.searchText !== null && this.searchText !== '') {
                this.getSearchProductList();
            }
        }
    }

    goBack() {
        this.location.back();
    }

    /**
     * Redirect on drug request screen
     */
    openDrugRequestPage() {
        this.router.navigate([`${environment.appPrefix}/drug-request`]);
    }
}
