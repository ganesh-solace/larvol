import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KolsService } from './../../../core/service/kols/kols.service';
import { UtilService } from './../../../core/service/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MessageService } from './../../../core/service/message/message.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-kols-star-view',
    templateUrl: './kols-star-view.component.html',
    styleUrls: ['./kols-star-view.component.scss']
})
export class KolsStarViewComponent implements OnInit {

     /**
     * changeData output function emit when user change the drug premium/nonpremium
     */
    @Output() changeData: EventEmitter<any> = new EventEmitter<any>();

    @Input() kolsData: any;
    @Input() index: number;

    loggedUserData: any;
    userMode: any;
    isLAPP = false;
    isFreeUser = false;
    requestText = '';
    activeModal: any;
    starTitle = '';
    bookmarkTitle = 'Bookmark';

    constructor(
        private kolsService: KolsService,
        private utilService: UtilService,
        private modalService: NgbModal,
        private router: Router,
        private messageService: MessageService,
    ) {
        this.loggedUserData = this.utilService.getLoggedUserData();
        if (this.loggedUserData !== null || this.loggedUserData !== undefined || this.loggedUserData !== '') {
            this.userMode = this.loggedUserData['mode'];
            // if (this.userMode === 'pulse' && this.loggedUserData['role'] === 'usr') {
            //     this.isLAPP = true;
            // }

            // tslint:disable-next-line:max-line-length
            // if (this.loggedUserData['active_subscription'] === null || this.loggedUserData['active_subscription'] === 'unsubscribe' || this.loggedUserData['active_subscription'] === 'premium') {
            //     this.isLAPP = true;
            // }

            if (this.loggedUserData['organizations'].length === 0) {
                this.isLAPP = true;
                // this.isFreeUser = true;
            } else {
                this.starTitle = '';
            }

            // if (this.loggedUserData['subscription'] !== null) {
            //     this.isFreeUser = false;
            // }
        }
    }

    ngOnInit() {
        if (this.kolsData !== undefined) {
            if (this.kolsData.favourite) {
                if (this.loggedUserData['organizations'].length === 0) {
                    this.starTitle = 'Remove Premium';
                } else {
                    this.starTitle = '';
                }
            } else {
                if (this.loggedUserData['organizations'].length === 0) {
                    this.starTitle = 'Add Premium';
                } else {
                    this.starTitle = '';
                }
            }
            if (this.kolsData.bookmark) {
                this.bookmarkTitle = 'Unbookmark';
            } else {
                this.bookmarkTitle = 'Bookmark';
            }
        }
    }

    /**
     * Add or Remove Kols as Favourite
     * @param item
     */
    addOrRemoveFavouriteKols(item: any, content: any) {
        this.messageService.setHttpLoaderStatus(true);
        if (this.isLAPP) {
            if (item.favourite) {
                this.kolsService.removeFavoriteKOLsById(item.kol_id)
                .then((res: any) => {
                    if (res['success']) {
                        item.favourite = false;
                        if (this.loggedUserData['organizations'].length === 0) {
                            this.starTitle = 'Add Premium';
                        } else {
                            this.starTitle = '';
                        }
                        this.changeData.emit({data: this.kolsData, index: this.index});
                        this.messageService.setKolsListEditStatus(false);
                    } else {
                        this.utilService.showError('Error', res['message']);
                    }
                }).catch((err: any) => {
                    console.log(err);
                    this.utilService.showError('Error', err['message']);
                });
            } else {
                this.kolsService.addFavoriteKOLsById(item.kol_id)
                .then((res: any) => {
                    if (res['success']) {
                        item.favourite = true;
                        if (this.loggedUserData['organizations'].length === 0) {
                            this.starTitle = 'Remove Premium';
                        } else {
                            this.starTitle = '';
                        }
                        this.changeData.emit({data: this.kolsData, index: this.index});
                        this.messageService.setKolsListEditStatus(false);
                    } else {
                        this.utilService.showError('Error', res['message']);
                    }
                }).catch((err: any) => {
                    console.log(err);
                    if (err.status === 400) {
                        this.requestText = err.error.message;
                        this.activeModal = this.modalService.open(content);
                    } else {
                        this.utilService.showError('Error', err['message']);
                    }
                });
            }
        }
        // } else {
            // if (!item.favourite) {
                // this.requestText = 'You have favorited the maximum number of KOLs for your subscription. To favorite additional KOLs, unfavorite other KOLs or adjust your subscription';
                // this.requestText = 'You have reached the maximum number of premium KOLs for your current subscription. We will contact you to discuss further. Thanks!';
                // this.activeModal = this.modalService.open(content);
                // this.kolsService.addFavoriteKOLsById(item.kol_id)
                // .then((res: any) => {
                //     if (res['success']) {
                //         item.favourite = true;
                //     } else {
                //         this.utilService.showError('Error', res['message']);
                //     }
                // }).catch((err: any) => {
                //     console.log(err);
                //     if (err.status === 400) {
                //         this.requestText = err.error.message;
                //         this.activeModal = this.modalService.open(content);
                //     } else {
                //         this.utilService.showError('Error', err['message']);
                //     }
                // });
            // }
        // }
    }

    close() {
        this.activeModal.close();
    }

    /**
     * Request for more KOls to add as Favorite
     */
    requestForKol() {
        this.activeModal.close();
        this.messageService.setShowSearchFlag(false);
        this.router.navigate([`${environment.appPrefix}/counter-request`]);
    }

    /**
     * Add or Remove kol ad bookmark
     * @param item
     */
    addOrRemoveBookmarkKols(item: any) {
        this.messageService.setHttpLoaderStatus(true);
        if (item.bookmark) {
            this.kolsService.removeBookmarkKOLsById(item.kol_id)
            .then((res: any) => {
                if (res['success']) {
                    item.bookmark = false;
                } else {
                    this.utilService.showError('Error', res['message']);
                }
            }).catch((err: any) => {
                console.log(err);
                this.utilService.showError('Error', err['message']);
            });
        } else {
            this.kolsService.addBookmarkKOLsById(item.kol_id)
            .then((res: any) => {
                if (res['success']) {
                    item.bookmark = true;
                } else {
                    this.utilService.showError('Error', res['message']);
                }
            }).catch((err: any) => {
                console.log(err);
                this.utilService.showError('Error', err['message']);
            });
        }
    }
}
