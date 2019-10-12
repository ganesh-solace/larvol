import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { MessageService } from './../../core/service/message/message.service';
import { UtilService } from './../../core/service/util.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { UserService } from './../../core/service/user/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignOutModalComponent } from './../common/sign-out-modal/sign-out-modal.component';
import 'rxjs/add/operator/pairwise';
import { environment } from '../../../environments/environment';
declare var $: any;

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

    shouldShow: Boolean = false;
    searchText: string;
    isHomePage = true;
    KOLsData: any;
    isShow = false;
    notificationCounts = 0;
    usersData: any;
    isKolsActive = true;
    placeHolder = 'Search KOLs';
    searchExist = false;
    isClick = false;
    isShowNotification = false;
    searchReference: any;
    oldSearchText = '';
    currentYear: Number;
    isLogin = false;
    routerRef: any;
    isSearchFocus = false;
    kolListRef: any;
    selectedEntityRef: any;
    selectedEntity = 'kol';
    isDrugActive = false;
    isDrugShow = false;
    backRef: any;
    headerRef: any;

    constructor(
        private renderer: Renderer2,
        private messageService: MessageService,
        private utilService: UtilService,
        private router: Router,
        private userService: UserService,
        private modalService: NgbModal,
        private activatedRoute: ActivatedRoute
    ) {
        this.routerRef = this.router.events.filter(event => event instanceof NavigationEnd)
            .subscribe(e => {
                if (this.utilService.isLoggedIn()) {
                    this.isLogin = true;
                    this.getLoginUserDetail();
                } else {
                    this.isLogin = false;
                }
            });

        if (this.router.url === environment.appPrefix) {
            this.isKolsActive = true;
            this.searchText = '';
            this.oldSearchText = '';
            this.searchExist = false;
            this.checkActiveTabData();
        } else {
            this.isKolsActive = false;
            this.isDrugActive = false;
        }
        this.KOLsData = localStorage.getItem('header_title');
        if (this.KOLsData !== null) {
            this.isHomePage = false;
        } else {
            this.KOLsData = '';
            this.isHomePage = true;
        }

        /** get status of header data is set of not and show search textbox on header or not */
        this.headerRef = this.messageService.getKolsData().subscribe(res => {
            this.KOLsData = res;
            if (this.KOLsData !== null && this.KOLsData !== '') {
                this.isHomePage = false;
                if (localStorage.getItem('header_title') !== null && localStorage.getItem('header_title') !== undefined) {
                    this.KOLsData = localStorage.getItem('header_title');
                }
                if (this.KOLsData === 'null') {
                    this.KOLsData = '';
                }
                if (Object.keys(this.KOLsData).length === 0 && this.KOLsData.constructor === Object) {
                    this.KOLsData = '';
                }
            } else {
                this.isHomePage = true;
                this.oldSearchText = '';
                this.setSearchTextSettings();
                this.KOLsData = '';
            }
            if (this.router.url === environment.appPrefix) {
                this.searchText = '';
                this.oldSearchText = '';
                this.searchExist = false;
                localStorage.removeItem('ksearch_text');
                this.checkActiveTabData();
            } else {
                this.isKolsActive = false;
                this.isDrugActive = false;
            }
        });

        /** Hide the search auto suggestion box and check exist search text */
        this.searchReference = this.messageService.getShowSearchFlag().subscribe(res => {
            this.isShow = false;
            this.isSearchFocus = false;
            this.isDrugShow = false;
            this.renderer.removeClass(document.body, 'body-overflow');
            const search = localStorage.getItem('ksearch_text');
            if (search === null || search === '') {
              this.router.navigate([`/${environment.appPrefix}`]);
            }
            if (search === null) {
                this.searchText = '';
                this.oldSearchText = '';
                if (localStorage.getItem('kAdvanced_search_data') === '') {
                    this.searchExist = false;
                } else {
                    this.searchExist = true;
                }
            } else {
                this.searchText = search;
                this.searchExist = true;
            }
            if (this.router.url === environment.appPrefix) {
                this.searchExist = false;
                this.searchText = '';
                this.oldSearchText = '';
            } else {
                if (this.searchText !== '') {
                    localStorage.setItem('ksearch_text', this.searchText);
                }
            }
            this.setSearchTextSettings();
        });

        /** check is exist kol list is updated by user or not if yes then get user detail from API */
        this.kolListRef = this.messageService.getKolsListEditStatus().subscribe(res => {
            if (this.utilService.isLoggedIn()) {
                this.isLogin = true;
                this.getLoginUserDetail();
            } else {
                this.isLogin = false;
            }
        });

        /** Check which entity is selected on dashboard and based on this set searchbox settings */
        this.selectedEntityRef = this.messageService.getSelectedEntityData().subscribe((res: any) => {
            if (res !== undefined) {
                this.selectedEntity = res;
                this.setPlaceholderForSearchBox('');
                this.checkActiveTabData();
            }
        });

        this.backRef = this.messageService.getBrowserBackStatus().subscribe(res => {
          if (res) {
            this.isShow = false;
            this.isDrugShow = false;
            this.isSearchFocus = false;
            this.renderer.removeClass(document.body, 'body-overflow');
          }
        });
    }

    ngOnInit() {
        const date = new Date();
        this.currentYear = date.getFullYear();
        if (this.utilService.isLoggedIn()) {
            this.isLogin = true;
        } else {
            this.isLogin = false;
        }
    }

    ngOnDestroy() {
        if (!!this.routerRef) {
            this.routerRef.unsubscribe();
        }

        if (!!this.kolListRef) {
            this.kolListRef.unsubscribe();
        }

        if (!!this.searchReference) {
            this.searchReference.unsubscribe();
        }

        if (!!this.selectedEntityRef) {
            this.selectedEntityRef.unsubscribe();
        }

        if (!!this.backRef) {
          this.backRef.unsubscribe();
        }

        if (!!this.headerRef) {
          this.headerRef.unsubscribe();
        }
    }

    setSearchTextSettings() {
        const self = this;
        $(document).ready(function () {
            let timer;
// tslint:disable-next-line: prefer-const
            let x;

            $('#searchInput').keydown(function () {
                if (self.selectedEntity === 'kol') {
                    self.isShow = true;
                } else {
                    self.isDrugShow = true;
                }
                if (x) { x.abort(); }
                clearTimeout(timer);
                timer = setTimeout(function () {
                    self.doSearch();
                }, 1000);
            });
        });
    }

    /**
    * Get current login user detail
    */
    getLoginUserDetail() {
        this.userService.getUserDetail()
            .then((userRes: any) => {
                if (userRes['success']) {
                    this.utilService.setLoggedUserData(JSON.stringify(userRes['data']));
                    this.messageService.setLoggedUserData(userRes['data']);
                    this.usersData = userRes['data'];
                    this.notificationCounts = this.usersData['push_notifications_count'];

                    if (this.usersData['organizations'].length === 0) {
                        this.isShowNotification = false;
                    } else {
                        this.isShowNotification = true;
                    }
                } else {
                    this.messageService.setLoggedUserData(null);
                }
            }).catch((err: any) => {
                console.log(err);
                this.messageService.setLoggedUserData(null);
            });
    }

    hideShowClass(pageUrl: any) {
        if (!this.shouldShow) {
            this.renderer.addClass(document.body, 'bodyFixed');
        } else {
            this.renderer.removeClass(document.body, 'bodyFixed');
        }
        this.shouldShow = !this.shouldShow;
        // this.searchText = '';
        // this.oldSearchText = '';
        // this.searchExist = false;
        this.isShow = false;
        this.isSearchFocus = false;
        this.isDrugShow = false;
        if (this.router.url !== '/kols-list' && this.router.url !== '/drug-search-result') {
            this.searchText = '';
            this.oldSearchText = '';
            this.searchExist = false;
        }
        this.renderer.removeClass(document.body, 'body-overflow');
        if (pageUrl !== '' && pageUrl !== 'kol' && pageUrl !== 'drug') {
            if (pageUrl === '/terms-of-service') {
                this.router.navigate([pageUrl]);
            } else if (pageUrl === '/privacy-policy') {
                 this.router.navigate([pageUrl]);
            } else if (pageUrl === 'home') {
                this.router.navigate([`${environment.appPrefix}`]);
            } else {
                if (pageUrl !== 'menu') {
                    this.router.navigate([`${environment.appPrefix}${pageUrl}`]);
                }
            }
        } else {
            console.log(pageUrl);
            if (pageUrl === 'kol' || pageUrl === 'drug') {
                localStorage.setItem('selectedEntity', pageUrl);
                this.messageService.setSelectedEntityData(pageUrl);
                this.router.navigate([`${environment.appPrefix}`]);
            }
        }
    }

    /**
    * search Kols data
    * @param event
    */
    search(event: any) {
        this.messageService.setKolsSearchTextIsStart(this.searchText);
    }

    doSearch() {
        if (this.oldSearchText !== this.searchText) {
            this.messageService.setKolsSearchText(this.searchText);
        }
        this.oldSearchText = this.searchText;
    }

    enterKeyPress(event: any) {
        this.oldSearchText = '';
        this.doSearch();
    }

    /**
    * *Signout modal
    */
    signOutModal() {
        const activeModal = this.modalService.open(SignOutModalComponent, { size: 'sm' });
    }

    /**
    * open recent search text when focus on textbox
    * @param event
    */
    getSearchBoxFocus(event: any) {
        if (localStorage.getItem('selectedEntity') !== null && localStorage.getItem('selectedEntity') !== '' && localStorage.getItem('selectedEntity') !== undefined) {
            this.selectedEntity = localStorage.getItem('selectedEntity');
        } else {
            localStorage.setItem('selectedEntity', 'kol');
        }
        this.isSearchFocus = true;
        if (this.selectedEntity === 'kol') {
            // tslint:disable-next-line:max-line-length
            if (localStorage.getItem('kAdvanced_search_data') === null || localStorage.getItem('kAdvanced_search_data') === '' || localStorage.getItem('kAdvanced_search_data') === undefined) {
                this.isShow = true;
                this.searchExist = false;
                this.renderer.addClass(document.body, 'body-overflow');
            } else {
                this.router.navigate([`${environment.appPrefix}/advance-search`]);
            }
        } else {
            this.isDrugShow = true;
            this.searchExist = false;
            this.renderer.addClass(document.body, 'body-overflow');
        }
    }

    removeSearchBoxFocus(event: any) {
        if (this.selectedEntity === 'kol') {
            if (!this.isShow) {
                this.isSearchFocus = false;
            }
        }
        if (this.selectedEntity === 'drug') {
            if (!this.isDrugShow) {
                this.isSearchFocus = false;
            }
        }
        this.setPlaceholderForSearchBox('');
    }

    clickSideMenu() {
        this.isClick = true;
    }

    closeSideMenu() {
        if (this.isClick) {
            this.isClick = false;
        } else {
            if (!this.shouldShow) {
                this.renderer.addClass(document.body, 'bodyFixed');
            } else {
                this.renderer.removeClass(document.body, 'bodyFixed');
            }
            this.shouldShow = !this.shouldShow;
        }
    }

    logoClick() {
        this.searchText = '';
        this.searchExist = false;
        this.isShow = false;
        this.isSearchFocus = false;
        this.oldSearchText = '';
        this.isDrugShow = false;
        localStorage.setItem('selectedEntity', 'kol');
        this.router.navigate([`${environment.appPrefix}`]);
    }

    /**
    * Open all search result screen click on search icon from herder
    */
    openSearchResultScreen() {
        if (this.searchText.length >= 3) {
            this.messageService.setKolsSearchIconClick(true);
        }
    }

    getNameInitials() {
        if (this.usersData !== undefined) {
            let name = '';
            if (this.usersData.first_name !== null) {
                name = `${this.usersData.first_name.split(' ')[0][0]}`;
            }
            if (this.usersData.last_name !== null) {
                name = name + `${this.usersData.last_name.split(' ')[0][0]}`;
            }
            return name;
            // return `${this.usersData.first_name.split(' ')[0][0]}${this.usersData.last_name.split(' ')[0][0]}`;
        } else {
            return;
        }
    }

    /**
     * Set placeholder text when focusout from search box
     */
    setPlaceholderForSearchBox(event: any) {
        if (this.selectedEntity === 'kol') {
            this.placeHolder = 'Search KOLs';
        } else {
            this.placeHolder = 'Search drugs';
        }
    }

    /**
     * Check which entity is active
     */
    checkActiveTabData() {
        if (localStorage.getItem('selectedEntity') !== null && localStorage.getItem('selectedEntity') !== '' && localStorage.getItem('selectedEntity') !== undefined) {
            this.selectedEntity = localStorage.getItem('selectedEntity');
            if (this.selectedEntity === 'kol') {
                this.isKolsActive = true;
                this.isDrugActive = false;
            } else {
                this.isDrugActive = true;
                this.isKolsActive = false;
            }
        } else {
            this.isKolsActive = true;
            this.isDrugActive = false;
        }
    }

    getRedirectionlink(pageUrl: any) {
        return `${environment.appPrefix}${pageUrl}`;
    }
}
