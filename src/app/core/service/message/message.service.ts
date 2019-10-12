import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    searchKols = new Subject<any>();
    searchKolsStart = new Subject<any>();
    KOLsData = new Subject<any>();
    isLoader = new Subject<any>();
    showSearchPage = new Subject<any>();
    hideSearchBox = new Subject<any>();
    isClickSearchIcon = new Subject<any>();
    isKOLListEdit = new Subject<any>();
    userData = new Subject<any>();
    selectedEntity = new Subject<any>();
    openCommentList = new Subject<any>();
    openLikeList = new Subject<any>();
    isBack = new Subject<any>();

    constructor() { }

    /**
     * Set Kols serach data for pass into on home page
     * @param data
     */
    setKolsSearchText(data: any) {
        this.searchKols.next(data);
    }

    /**
     * Get Kols serach data for pass into on home page
     */
    getKolsSearchText(): Observable<any> {
        return this.searchKols.asObservable();
    }

    /**
     * Set Kols data for pass into on home page
     * @param data
     */
    setKolsData(data: any) {
        this.KOLsData.next(data);
    }

    /**
     * Get Kols data for pass into on home page
     */
    getKolsData(): Observable<any> {
        return this.KOLsData.asObservable();
    }

    /**
     * Set HTTP Loader show status when calling rest API to server
     * @param data
     */
    setHttpLoaderStatus(data: any) {
        this.isLoader.next(data);
    }

    /**
     * Get HTTP Loader show status when calling rest API to server
     */
    getHttpLoaderStatus(): Observable<any> {
        return this.isLoader.asObservable();
    }

    setShowSearchFlag(data: any) {
        this.showSearchPage.next(data);
    }

    getShowSearchFlag(): Observable<any> {
        return this.showSearchPage.asObservable();
    }

    setHideSearchBoxStatus(data: any) {
        this.hideSearchBox.next(data);
    }

    getHideSearchBoxStatus(): Observable<any> {
        return this.hideSearchBox.asObservable();
    }

    setKolsSearchTextIsStart(data: any) {
        this.searchKolsStart.next(data);
    }

    getKolsSearchTextIsStart(): Observable<any> {
        return this.searchKolsStart.asObservable();
    }

    /**
     * Set flag when user click on search icon from header
     * @param data
     */
    setKolsSearchIconClick(data: any) {
        this.isClickSearchIcon.next(data);
    }

    /**
     * Get search icon click flag for redirect on search result page
     * @param data
     */
    getKolsSearchIconClick(): Observable<any> {
        return this.isClickSearchIcon.asObservable();
    }

    setKolsListEditStatus(data: any) {
        this.isKOLListEdit.next(data);
    }

    getKolsListEditStatus(): Observable<any> {
        return this.isKOLListEdit.asObservable();
    }

    /**
     * update login user data
     * @param data
     */
    setLoggedUserData(data: any) {
        this.userData.next(data);
    }

    /**
     * get updated login user data
     */
    getLoggedUserData(): Observable<any> {
        return this.userData.asObservable();
    }

    /**
     * Update selected entity data when user changes it from landing page
     * @param data
     */
    setSelectedEntityData(data: any) {
        this.selectedEntity.next(data);
    }

    /**
     * Get selected or active entity
     */
    getSelectedEntityData(): Observable<any> {
        return this.selectedEntity.asObservable();
    }

    /**
     * Update comment box open status for drug entity news item
     * @param data
     */
    setOpenCommentBoxStatus(data: any) {
        this.openCommentList.next(data);
    }

    /**
     * Get comment box open status for drug entity news item
     */
    getOpenCommentBoxStatus(): Observable<any> {
        return this.openCommentList.asObservable();
    }

    /**
     * Set status for like list popup when click on notification
     * @param data
     */
    setLikelistOpenStatus(data: any) {
        this.openLikeList.next(data);
    }

    /**
     * Get status for like list popup when click on notification
     */
    getLikelistOpenStatus(): Observable<any> {
        return this.openLikeList.asObservable();
    }

    setBrowserBackStatus(data: any) {
      this.isBack.next(data);
    }

    getBrowserBackStatus(): Observable<any> {
      return this.isBack.asObservable();
    }
}
