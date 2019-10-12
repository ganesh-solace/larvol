import { Component, OnInit, Input, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from './../../../core/service/message/message.service';
import { HomeService } from './../../../core/service/home/home.service';
import { Router } from '@angular/router';
import { UtilService } from './../../../core/service/util.service';
import { environment } from '../../../../environments/environment';
import { GoogleAnalyticsService } from 'src/app/core/service/google-analytics.service';
import { EventsData } from 'src/app/core/service/gaEventsData';

@Component({
    selector: 'app-kols-search-list',
    templateUrl: './kols-search-list.component.html',
    styleUrls: ['./kols-search-list.component.scss']
})
export class KolsSearchListComponent implements OnInit, OnDestroy {

    @Input() searchText: any;
    @ViewChild('instituteList') instituteList: ElementRef;
    isClick = false;
    searchReference: any;
    currentPage = 1;
    kolsData: any = [];
    showData = false;
    recentSearchData: any = [];
    isLoad = false;
    searchStartReference: any;
    ifAdvancedSearch = false;
    name = '';
    institute = '';
    showInstitue = false;
    allInstituteList: any = [];
    instituteLoad = false;
    instituteCurrentPage = 1;
    showState = false;
    state = '';
    showCountry = false;
    country = '';
    searchIconReference: any;
    isRecentLoad = false;

    constructor(
        private messageService: MessageService,
        private homeService: HomeService,
        private router: Router,
        private utilService: UtilService,
        private gaService:GoogleAnalyticsService
    ) {
        // this.recentSearchData = JSON.parse(localStorage.getItem('krecent_search'));
        this.searchReference = this.messageService.getKolsSearchText().subscribe(res => {
            this.searchText = res;
            this.showData = true;
            this.isLoad = true;
            if (this.searchText.length >= 3) {
                this.getSearchKOlsList();
            } else {
                this.isLoad = false;
                this.kolsData = [];
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
                this.getSearchKOlsList();
            }
        } else {
            this.kolsData = [];
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

    clickSearchPage() {
        this.isClick = true;
    }

    /**
    * Get all KOL list based on search keyword
    */
    getSearchKOlsList() {
        this.kolsData = [];
        this.isLoad = true;
        this.messageService.setHttpLoaderStatus(false);
        const postObj = {
            'page': this.currentPage,
            'suggestion': true,
        };

        if (this.searchText !== '') {
            postObj['query'] = this.searchText;
        }
        // this.homeService.getAllLAPPKOls(postObj)
        this.homeService.getSearchKolsData(postObj)
            .then(res => {
                console.log(res);
                if (res['success']) {
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
                    });
                    this.kolsData = res['data']['data'];
                    if (res['data']['next_page']) {
                        this.currentPage += 1;
                    }
                    console.log(this.kolsData);
                }
                this.isLoad = false;
            }).catch(err => {
                console.log(err);
                this.isLoad = false;
            });
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

    /**
    * Open KOLs detail for selected or clicked KOLs
    * @param item
    */
    openKOLsDetail(item: any) {
        // const obj = {
        //     'name': item.kol_full_name,
        //     'image_url': item.kol_image_url,
        //     'qualification': item.kol_qualification,
        //     'isKol': true,
        //     'kol_id': item.kol_id
        // };
        // this.setRecentSearchData(obj);

        if (!!this.searchReference) {
            this.searchReference.unsubscribe();
        }
        this.saveRecentSearchData(item.kol_id);
        this.messageService.setShowSearchFlag(false);
        this.messageService.setHttpLoaderStatus(true);
        this.router.navigate([`${environment.appPrefix}/kol-entity/${btoa(item.kol_id)}`]);
    }

    /**
    * Open KOl list or KOl detail page click on recent search data
    * @param item
    */
    openRecentSearchKOl(item: any) {
        if (item.kol_id !== null && item.kol_id !== '') {
            if (!!this.searchReference) {
                this.searchReference.unsubscribe();
            }
            this.saveRecentSearchData(item.kol_id);
            this.messageService.setShowSearchFlag(false);
            this.messageService.setHttpLoaderStatus(true);
            localStorage.setItem('isRecentSearch', 'true');
            this.router.navigate([`${environment.appPrefix}/kol-entity/${btoa(item.kol_id)}`]);
        } else {
            localStorage.setItem('ksearch_text', item.search_text);
            this.saveRecentSearchData(item.search_text);
            this.messageService.setShowSearchFlag(false);
            this.messageService.setHttpLoaderStatus(true);
            this.router.navigate([`${environment.appPrefix}/kols-list`]);
        }
    }

    /**
    * Show all result for search keyword
    */
    openSearchResultPage() {
        if (this.searchText.length >= 3) {
            // const obj = {
            //     'name': this.searchText,
            //     'image_url': './../../../assets/images/search.png',
            //     'qualification': '',
            //     'isKol': false,
            //     'kol_id': 0
            // };
            // this.setRecentSearchData(obj);
            this.saveRecentSearchData(this.searchText);
            localStorage.setItem('ksearch_text', this.searchText);
            this.messageService.setShowSearchFlag(false);
            this.messageService.setHttpLoaderStatus(true);
            this.router.navigate([`${environment.appPrefix}/kols-list`]);
        }
    }

    /**
    * Set recent search data in localstorage
    * @param item
    */
    setRecentSearchData(item) {
        this.recentSearchData = JSON.parse(localStorage.getItem('krecent_search'));
        let index = '';
        if (this.recentSearchData !== null) {
            if (this.recentSearchData.length === 10) {
                this.recentSearchData.splice(0, 1);
            }
            for (const x of Object.keys(this.recentSearchData)) {
                if (this.recentSearchData[x]['name'].toLowerCase() === item.name.toLowerCase()) {
                    index = <any>x;
                }
            }
            item['image_path'] = './assets/images/avtar.png';
            if (index !== '') {
                this.recentSearchData.splice(index, 1);
                this.recentSearchData.push(item);
                // this.recentSearchData[index] = item;
            } else {
                this.recentSearchData.push(item);
            }
            // this.recentSearchData.push(item);
        } else {
            this.recentSearchData = [];
            this.recentSearchData.push(item);
        }
        console.log(this.recentSearchData);
        localStorage.setItem('krecent_search', JSON.stringify(this.recentSearchData));
    }

    /**
    * Clear all recent search data from localstorage
    */
    clearAllRecentData() {
        // localStorage.removeItem('krecent_search');
        // this.recentSearchData = JSON.parse(localStorage.getItem('krecent_search'));
        console.log(this.recentSearchData);
        this.homeService.deleteRecentSearchData()
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
    * check image is exist or not if not than create placehoolder image with kol firstname and lastname
    * @param item
    */
    checkImageExistorNot(item: any) {
        if (item.kol_id !== null && item.kol_id !== '') {
            item['kol_image'] = '';
// tslint:disable-next-line: no-shadowed-variable
            const _name = item.kol_fullname;
            if (_name !== null && _name !== undefined) {
                // item['kol_short_name'] = this.utilService.getNameInitials(_name);
                if (item.kol_first_name !== null) {
                    item['kol_short_name'] = `${item.kol_first_name.split(' ')[0][0]}`;
                }
                if (item.kol_last_name !== null) {
                    item['kol_short_name'] = item['kol_short_name'] + `${item.kol_last_name.split(' ')[0][0]}`;
                }
            }
        } else {
            item['kol_image'] = './assets/images/search.png';
        }

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

    showStateList() {
        if (this.state !== '') {
            this.showState = true;
        } else {
            this.showState = false;
        }
    }

    showCountryList() {
        if (this.country !== '') {
            this.showCountry = true;
        } else {
            this.showCountry = false;
        }
    }

    showInstituteList() {
        if (this.institute.length >= 3) {
            this.messageService.setHttpLoaderStatus(false);
            this.showInstitue = true;
            this.instituteLoad = true;
            const postObj = {
                'page': this.instituteCurrentPage,
                'suggestion': true,
                'query': this.institute
            };
            this.homeService.getAllInstituteList(postObj)
                .then((res) => {
                    if (res['success']) {
                        if (res['next_page']) {
                            this.instituteCurrentPage++;
                        }
                        for (const x of Object.keys(res['data']['data'])) {
                            this.allInstituteList.push(res['data']['data'][x]);
                        }
                    }
                    this.instituteLoad = false;
                }).catch((err) => {
                    console.log(err);
                    this.instituteLoad = false;
                });
        } else {
            this.showInstitue = false;
        }
    }

    onInstituteScroll(event) {
        console.log(event);
        // tslint:disable-next-line:max-line-length
        if ((this.instituteList.nativeElement.scrollHeight - this.instituteList.nativeElement.scrollTop) === this.instituteList.nativeElement.clientHeight) {
            console.log('scroll');
        }
    }

    clickOnAdvanceSearch() {
        this.messageService.setShowSearchFlag(false);
        this.messageService.setHttpLoaderStatus(true);
        this.router.navigate([`${environment.appPrefix}/advance-search`]);
    }

    /**
    * save recent search data on server
    */
    saveRecentSearchData(text: any) {
        this.messageService.setHttpLoaderStatus(false);
        const postObj = {};

        if (text > 0) {
            postObj['kol_id'] = text;
        } else {
            postObj['text'] = text;
        }

        this.homeService.saveRecentSearchData(postObj)
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
    * Get all existing recent search data
    */
    getAllRecentSearchData() {
        this.isRecentLoad = true;
        this.messageService.setHttpLoaderStatus(false);
        this.homeService.getRecentSearchData()
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

    imageLoadSuccess(item: any) {
        item['imageLoad'] = true;
    }

    openPageUrl(pageUrl: any) {
        this.closePage();
        this.router.navigate([`${environment.appPrefix}${pageUrl}`]);
    }

    // Google Analytics search event tracking in for kols
    searchTermGoogleAnalytics(selectedKol){
        let selectedEntity
        EventsData.kolsSearchAction = selectedKol;
        EventsData.kolsSearchLabel = this.searchText;
        selectedEntity = localStorage.getItem('selectedEntity');
        if (selectedEntity === 'kol'){
            if( EventsData.kolsSearchLabel === ""){
                EventsData.kolsSearchLabel = "From Recent Search"
            }
            this.gaService.emitEvent(EventsData.kolsSearchCategory,EventsData.kolsSearchAction,EventsData.kolsSearchLabel,10);
        } else {
        }
    }
}
