import { Component, OnInit, Input } from '@angular/core';
import { KolsService } from './../../../core/service/kols/kols.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from './../../../core/service/message/message.service';
import { UtilService } from './../../../core/service/util.service';

@Component({
    selector: 'app-kols-likes-list',
    templateUrl: './kols-likes-list.component.html',
    styleUrls: ['./kols-likes-list.component.scss']
})
export class KolsLikesListComponent implements OnInit {

    @Input() newsData: any;
    likesData: any = [];
    totalLikes = 0;
    nextPage: any;
    isLoad = false;
    likesAllData: any;

    constructor(
        private kolsService: KolsService,
        private activeModal: NgbActiveModal,
        private messageService: MessageService,
        private utilService: UtilService
    ) { }

    ngOnInit() {
        // this.getLikesData();
        if (this.likesAllData !== undefined) {
            this.isLoad = true;
            for (const x of Object.keys(this.likesAllData['data']['data'])) {
                this.likesData.push(this.likesAllData['data']['data'][x]);
            }
            this.nextPage = this.likesAllData['data']['next'];
            this.totalLikes = this.likesAllData['data']['total_likes'];
        }
    }

    /**
     * close active modal
     */
    closeModal() {
        this.activeModal.close();
        this.messageService.setHttpLoaderStatus(true);
    }

    /**
     * Get all Likes data by news Id
     */
    getLikesData() {
        let data = {};
        if (this.nextPage !== undefined && this.nextPage !== null) {
            data = {
                'next': this.nextPage,
            };
        }
        this.kolsService.getLikedForNews(this.newsData['id'], data)
        .then((res: any) => {
            this.isLoad = true;
            if (res['success']) {
                for (const x of Object.keys(res['data']['data'])) {
                    this.likesData.push(res['data']['data'][x]);
                }
                this.nextPage = res['data']['next'];
                this.totalLikes = res['data']['total_likes'];
            }
        }).catch((err: any) => {
            this.isLoad = true;
            console.log(err);
        });
    }

    /**
     * Load more likes data when user scroll down
     * @param event
     */
    onScroll(event: any) {
        if (this.nextPage !== undefined && this.nextPage !== null) {
            this.messageService.setHttpLoaderStatus(false);
            this.getLikesData();
        }
    }

    getNameInitials(item: any) {
        // return this.utilService.getNameInitials(_name);
        return `${item.first_name.split(' ')[0][0]}${item.last_name.split(' ')[0][0]}`;
    }
}
