import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DrugsService } from './../../../core/service/drugs/drugs.service';
import { UtilService } from './../../../core/service/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from './../../../core/service/message/message.service';

@Component({
    selector: 'app-drug-star-view',
    templateUrl: './drug-star-view.component.html',
    styleUrls: ['./drug-star-view.component.scss']
})
export class DrugStarViewComponent implements OnInit {

    /**
     * changeData output function emit when user change the drug premium/nonpremium
     */
    @Output() changeData: EventEmitter<any> = new EventEmitter<any>();

    @Input() productData: any;
    @Input() index: number;

    starTitle = '';
    loggedUserData: any;
    userMode: any;
    isLAPP = false;
    requestText = '';
    activeModal: any;

    constructor(
        private drugsService: DrugsService,
        private utilService: UtilService,
        private modalService: NgbModal,
        private messageService: MessageService,
    ) {
        this.loggedUserData = this.utilService.getLoggedUserData();
        if (this.loggedUserData !== null || this.loggedUserData !== undefined || this.loggedUserData !== '') {
            this.userMode = this.loggedUserData['mode'];

            if (this.loggedUserData['organizations'].length === 0) {
                this.isLAPP = true;
            } else {
                this.starTitle = '';
            }
        }
    }

    ngOnInit() {
        if (this.productData !== undefined) {
            if (this.productData.favourite) {
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
        }
    }

    /**
     * Add or remove drug(product) as premium for individual user
     * @param item
     * @param content
     */
    addOrRemoveFavouriteDrug(item: any, content: any) {
        console.log(item);
        this.messageService.setHttpLoaderStatus(true);
        if (this.isLAPP) {
            if (item.favourite) {
                this.drugsService.removeFavoriteProductById(item.id)
                .then((res: any) => {
                    if (res['success']) {
                        item.favourite = false;
                        if (this.loggedUserData['organizations'].length === 0) {
                            this.starTitle = 'Add Premium';
                        } else {
                            this.starTitle = '';
                        }
                        // this.messageService.setKolsListEditStatus(false);
                        this.changeData.emit({data: this.productData, index: this.index});
                    } else {
                        this.utilService.showError('Error', res['message']);
                    }
                }).catch((err: any) => {
                    console.log(err);
                    this.utilService.showError('Error', err['message']);
                });
            } else {
                this.drugsService.addFavoriteProductById(item.id)
                .then((res: any) => {
                    if (res['success']) {
                        item.favourite = true;
                        if (this.loggedUserData['organizations'].length === 0) {
                            this.starTitle = 'Remove Premium';
                        } else {
                            this.starTitle = '';
                        }
                        // this.messageService.setKolsListEditStatus(false);
                        this.changeData.emit({data: this.productData, index: this.index});
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
    }

    close() {
        this.activeModal.close();
    }

}
