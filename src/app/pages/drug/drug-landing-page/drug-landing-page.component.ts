import { Component, OnInit, OnDestroy } from '@angular/core';
import { DrugsService } from './../../../core/service/drugs/drugs.service';
import { MessageService } from './../../../core/service/message/message.service';
import { Router } from '@angular/router';
import { environment } from './../../../../environments/environment';
import { UtilService } from './../../../core/service/util.service';

@Component({
    selector: 'app-drug-landing-page',
    templateUrl: './drug-landing-page.component.html',
    styleUrls: ['./drug-landing-page.component.scss']
})
export class DrugLandingPageComponent implements OnInit, OnDestroy {

    productsData: any = [];
    currentPage = 1;
    nextPage = false;
    isLoad = false;
    query = '';
    postObj: any = {};
    isApiRun = false;
    isLoadMore = false;
    loggedUserData: any;
    isLAPP = false;
    drugReference: any;
    ifAPISuccess: false;

    constructor(
        private drugsService: DrugsService,
        private messageService: MessageService,
        private router: Router,
        private utilService: UtilService
    ) {
        this.loggedUserData = this.utilService.getLoggedUserData();

        if (this.loggedUserData['organizations'].length === 0) {
            this.isLAPP = true;
        }

        this.drugReference = this.messageService.getHideSearchBoxStatus().subscribe(res => {
            if (res) {
                this.messageService.setHttpLoaderStatus(true);
                this.messageService.setKolsListEditStatus(true);
                if (!this.ifAPISuccess) {
                    if (localStorage.getItem('selectedEntity') === 'drug') {
                        this.isLoad = false;
                        this.currentPage = 1;
                        this.productsData = [];
                        this.getAllProductsList();
                    }
                }
            }
        });

    }

    ngOnInit() {
        this.messageService.setHttpLoaderStatus(true);
        this.getAllProductsList();
        localStorage.removeItem('showDrugDetail');
        localStorage.removeItem('kdrug_attribute');
    }

    ngOnDestroy() {
        if (!!this.drugReference) {
            this.drugReference.unsubscribe();
        }
    }

    /**
    * Get all premium products/drugs list from api and showing on landing page
    */
    getAllProductsList() {
        this.postObj = {
            'page': this.currentPage,
            'favourite': true
        };

        if (this.currentPage === 1) {
            this.isLoad = false;
        }

        this.drugsService.getAllProductsList(this.postObj)
            .then((res: any) => {
                console.log(res);
                if (res['success']) {
                    this.nextPage = res['data']['next_page'];
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
                    if (res['data']['next_page']) {
                        this.currentPage += 1;
                    }
                    this.isLoad = true;
                    this.isLoadMore = false;
                    this.isApiRun = false;
                } else {
                    this.isApiRun = false;
                }
            }).catch((err: any) => {
                console.log(err);
                this.isLoad = true;
                this.isApiRun = false;
            });
    }

    /**
    * Load more product list data with scroll down
    * @param event
    */
    onScroll(event: any) {
        console.log(event);
        if (this.nextPage) {
            if (!this.isLoadMore) {
                this.isLoadMore = true;
                this.isApiRun = true;
                this.messageService.setHttpLoaderStatus(false);
                this.getAllProductsList();
            }
        }
    }

    openProductDetail(item: any) {
        console.log(item);
        localStorage.setItem('header_title', item['name']);
        this.router.navigate([`${environment.appPrefix}/drug-entity/${btoa(item.id)}`]);
    }

    /**
     * refresh the page after premium/nonpremium drug by user
     */
    changeDataByUser(event: any) {
        console.log(event);
        if (event.index !== undefined) {
            this.productsData.splice(event.index, 1);
        }
    }

}
