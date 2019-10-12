import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { HomeService } from './../../../core/service/home/home.service';
import { MessageService } from './../../../core/service/message/message.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

declare var $: any;

@Component({
    selector: 'app-kol-advance-search',
    templateUrl: './kol-advance-search.component.html',
    styleUrls: ['./kol-advance-search.component.scss']
})
export class KolAdvanceSearchComponent implements OnInit, OnDestroy {
    @HostListener('document:click', ['$event'])
    clickout(event: any) {
        if (this.eRef.nativeElement.contains(event.target)) {
            console.log(event.srcElement.className);
            if (event.srcElement.className === 'kols-list advanced-search-list' || event.srcElement.className === 'advanced-search-form') {
                if (this.showInstitue) {
                    this.showInstitue = false;
                }
                if (this.showState) {
                    this.showState = false;
                }
                if (this.showCountry) {
                    this.showCountry = false;
                }
                if (this.showArea) {
                    this.showArea = false;
                }
                this.handleData();
            } else {
                if (event.srcElement.className.indexOf('institute') > -1) {
                    this.onFocusInInstitution('');
                } else if (event.srcElement.className.indexOf('state') > -1) {
                    this.onFocusInState('');
                } else if (event.srcElement.className.indexOf('country') > -1) {
                    this.onFocusInCountry('');
                } else if (event.srcElement.className.indexOf('area') > -1) {
                    this.onFocusInArea('');
                } else {
                    this.handleData();
                }
            }
        } else {
            this.handleData();
        }
    }

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
    headerTitle = '';
    allStateList: any = [];
    stateLoad = false;
    allCountryList: any = [];
    countryLoad = false;
    instituteNextPage = false;
    postObj = {
        state: '',
        country: '',
        institution_id: '',
        query: '',
        institution_name: '',
        area: '',
        area_name: ''
    };
    existInstitution = '';
    existState = '';
    existCountry = '';
    isInstitute = false;
    isState = false;
    isCountry = false;
    isInstituteClose = false;
    isStateClose = false;
    isCountryClose = false;
    area = '';
    showArea = false;
    allAreaList: any = [];
    areaLoad = false;
    existArea = '';
    isArea = false;
    isAreaClose = false;
    areaNextPage = false;
    areaCurrentPage = 1;

    constructor(
        private homeService: HomeService,
        private messageService: MessageService,
        private router: Router,
        private eRef: ElementRef,
    ) {
        if (this.headerTitle === '') {
            this.headerTitle = localStorage.getItem('header_title');
        }
        localStorage.setItem('header_title', 'Advanced Search');
        this.messageService.setKolsData('Advanced Search');

        if (localStorage.getItem('kAdvanced_search_data') !== null && localStorage.getItem('kAdvanced_search_data') !== '') {
            const data = JSON.parse(localStorage.getItem('kAdvanced_search_data'));
            this.postObj = data;
            this.state = data['state'];
            this.country = data['country'];
            this.name = data['query'];
            this.institute = data['institution_name'];
            this.area = data['area_name'];
            this.existCountry = this.country;
            this.existState = this.state;
            this.existInstitution = this.institute;
            this.existArea = this.area;
        }
    }

    ngOnInit() {
        const self = this;
        $(document).ready(function () {
            let timer1;
            let x1;
            let timer2;
            let x2;
            let timer3;
            let x3;
            $('#searchInstitute').keydown(function () {
                if (x1) { x1.abort(); }
                clearTimeout(timer1);
                timer1 = setTimeout(function () {
                    self.showInstituteList();
                }, 500);
            });
            $('#searchState').keydown(function () {
                if (x2) { x2.abort(); }
                clearTimeout(timer2);
                timer2 = setTimeout(function () {
                    self.showStateList();
                }, 500);
            });
            $('#searchCountry').keydown(function () {
                if (x3) { x3.abort(); }
                clearTimeout(timer3);
                timer3 = setTimeout(function () {
                    self.showCountryList();
                }, 500);
            });
            $('#searchArea').keydown(function () {
                if (x2) { x2.abort(); }
                clearTimeout(timer2);
                timer2 = setTimeout(function () {
                    self.showAreaList();
                }, 500);
            });
        });
    }

    ngOnDestroy() {
        this.messageService.setKolsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);
    }

    /**
    * Hide/Show auto suggestion section for state
    */
    showStateList() {
        if (this.state.length >= 1) {
            this.messageService.setHttpLoaderStatus(false);
            this.showState = true;
            this.stateLoad = true;
            this.allStateList = [];
            this.getAllStateList();
        } else {
            this.showState = false;
            this.allStateList = [];
        }
        this.showInstitue = false;
        this.showCountry = false;
        this.showArea = false;
    }

    /**
    * Hide/Show auto suggestion section for Area
    */
    showAreaList() {
        if (this.area.length >= 3) {
            this.areaCurrentPage = 1;
            this.messageService.setHttpLoaderStatus(false);
            this.showArea = true;
            this.areaLoad = true;
            this.allAreaList = [];
            this.getAllAreaList();
        } else {
            this.areaCurrentPage = 1;
            this.showArea = false;
            this.allAreaList = [];
            this.postObj['area_name'] = '';
            this.postObj['area'] = '';
        }
        this.showInstitue = false;
        this.showCountry = false;
        this.showState = false;
    }

    /**
    * Hide/Show auto suggestion section for country
    */
    showCountryList() {
        if (this.country.length >= 3) {
            this.messageService.setHttpLoaderStatus(false);
            this.showCountry = true;
            this.countryLoad = true;
            this.allCountryList = [];
            this.getAllCountryList();
        } else {
            this.showCountry = false;
            this.allCountryList = [];
        }
        this.showInstitue = false;
        this.showState = false;
        this.showArea = false;
    }

    /**
    * Hide/Show auto suggestion section for institute
    */
    showInstituteList() {
        if (this.institute.length >= 3) {
            this.instituteCurrentPage = 1;
            this.messageService.setHttpLoaderStatus(false);
            this.showInstitue = true;
            this.instituteLoad = true;
            this.getAllInstituteList();
            this.allInstituteList = [];
        } else {
            this.instituteCurrentPage = 1;
            this.showInstitue = false;
            this.allInstituteList = [];
            this.postObj['institution_name'] = '';
            this.postObj['institution_id'] = '';
        }
        this.showCountry = false;
        this.showState = false;
        this.showArea = false;
    }

    /**
    * Get all existing state list based on search query
    */
    getAllStateList() {
        const postObj = {
            'query': this.state
        };
        this.homeService.getAllStateList(postObj)
            .then((res) => {
                if (res['success']) {
                    for (const x of Object.keys(res['data']['data'])) {
                        this.allStateList.push(res['data']['data'][x]);
                    }
                }
                this.stateLoad = false;
            }).catch((err) => {
                console.log(err);
                this.stateLoad = false;
            });
    }

    /**
    * Get all existing country list based on search query
    */
    getAllCountryList() {
        const postObj = {
            'query': this.country
        };
        this.homeService.getAllCountryList(postObj)
            .then((res) => {
                if (res['success']) {
                    for (const x of Object.keys(res['data']['data'])) {
                        this.allCountryList.push(res['data']['data'][x]);
                    }
                }
                this.countryLoad = false;
            }).catch((err) => {
                console.log(err);
                this.countryLoad = false;
            });
    }

    /**
    * Get all existing institute list based on search query
    */
    getAllInstituteList() {
        const postObj = {
            'page': this.instituteCurrentPage,
            // 'suggestion': true,
            'query': this.institute
        };
        this.homeService.getAllInstituteList(postObj)
            .then((res) => {
                if (res['success']) {
                    this.instituteNextPage = res['data']['next_page'];
                    if (res['data']['next_page']) {
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
    }

    /**
    * Get all existing state list based on search query
    */
    getAllAreaList() {
        const postObj = {
            'query': this.area,
            'page': this.areaCurrentPage
        };
        this.homeService.getAllAreaList(postObj)
            .then((res) => {
                if (res['success']) {
                    this.areaNextPage = res['data']['next_page'];
                    if (res['data']['next_page']) {
                        this.areaCurrentPage++;
                    }
                    for (const x of Object.keys(res['data']['data'])) {
                        this.allAreaList.push(res['data']['data'][x]);
                    }
                }
                this.areaLoad = false;
            }).catch((err) => {
                console.log(err);
                this.areaLoad = false;
            });
    }

    /**
    * clear all search data
    */
    clearSearchData() {
        this.name = '';
        this.state = '';
        this.institute = '';
        this.country = '';
        this.area = '';
        this.postObj = {
            state: '',
            country: '',
            institution_id: '',
            institution_name: '',
            query: '',
            area: '',
            area_name: ''
        };
        localStorage.removeItem('kAdvanced_search_data');
    }

    /**
    * Load more institute list when user scroll
    * @param event
    */
    onScroll(event: any) {
        if (this.instituteNextPage) {
            this.getAllInstituteList();
        }
    }

    selectInstitution(item: any) {
        this.institute = item.display_name;
        this.existInstitution = item.display_name;
        this.postObj['institution_name'] = item.display_name;
        this.postObj['institution_id'] = item.id;
        this.showInstitue = false;
        this.isInstitute = false;
    }

    selectState(item: any) {
        this.state = item.state;
        this.existState = item.state;
        this.postObj['state'] = item.state;
        this.showState = false;
        this.isState = false;
    }

    selectCountry(item: any) {
        this.country = item.country;
        this.existCountry = item.country;
        this.postObj['country'] = item.country;
        this.showCountry = false;
        this.isCountry = false;
    }

    selectArea(item: any) {
        console.log(item);
        this.area = item.name;
        this.existArea = item.name;
        this.postObj['area_name'] = item.name;
        this.postObj['area'] = item.id;
        this.showArea = false;
        this.isArea = false;
    }

    /**
    * open search list api and calling api using search data
    */
    doAdvancedSearch() {
        this.messageService.setHttpLoaderStatus('true');
        if (this.name !== undefined && this.name !== null && this.name !== '') {
            this.postObj['query'] = this.name;
        }
        localStorage.setItem('kAdvanced_search_data', JSON.stringify(this.postObj));
        this.router.navigate([`${environment.appPrefix}/kols-list`]);
    }

    onFocusInInstitution(event: any) {
        // if (this.isInstituteClose) {
        //     this.isInstituteClose = false;
        // } else {
        //     this.institute = '';
        //     this.isInstitute = true;
        // }
    }

    onFocusInCountry(event: any) {
        if (this.isCountryClose) {
            this.isCountryClose = false;
        } else {
            this.country = '';
            this.isCountry = true;
        }
    }

    onFocusInState(event: any) {
        if (this.isStateClose) {
            this.isStateClose = false;
        } else {
            this.state = '';
            this.isState = true;
        }

    }

    onFocusInArea(event: any) {
        // if (this.isAreaClose) {
        //     this.isAreaClose = false;
        // } else {
        //     this.area = '';
        //     this.isArea = true;
        // }

    }

    closeInstitution() {
        // if (this.existInstitution !== null && this.existInstitution !== undefined) {
        //     this.institute = this.existInstitution;
        // }
        this.isInstituteClose = true;
        this.isInstitute = false;
        this.showInstitue = false;
    }

    closeState() {
        if (this.existState !== null && this.existState !== undefined) {
            this.state = this.existState;
        }
        this.isStateClose = true;
        this.isState = false;
        this.showState = false;
    }

    closeCountry() {
        if (this.existCountry !== null && this.existCountry !== undefined) {
            this.country = this.existCountry;
        }
        this.isCountryClose = true;
        this.isCountry = false;
        this.showCountry = false;
    }

    closeArea() {
        // if (this.existArea !== null && this.existArea !== undefined) {
        //     this.area = this.existArea;
        // }
        this.isAreaClose = true;
        this.isArea = false;
        this.showArea = false;
    }


    handleData() {
        if (this.postObj['institution_id'] === '') {
            this.institute = '';
            this.isInstitute = false;
            this.isInstituteClose = false;
        } else {
            // if (this.existInstitution !== null && this.existInstitution !== undefined) {
            //     this.institute = this.existInstitution;
            // }
            this.isInstitute = false;
            this.isInstituteClose = true;
        }
        if (this.postObj['state'] === '') {
            this.state = '';
            this.isState = false;
        } else {
            this.closeState();
        }

        if (this.postObj['country'] === '') {
            this.country = '';
            this.isCountry = false;
        } else {
            this.closeCountry();
        }

        if (this.postObj['area'] === '') {
            this.area = '';
            this.isArea = false;
        } else {
            this.closeArea();
        }
    }

    /**
    * Load more area list with scroll down
    * @param event
    */
    onAreaScroll(event: any) {
        if (this.areaNextPage) {
            this.getAllAreaList();
        }
    }

}
