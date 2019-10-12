import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { UtilService } from './../../../core/service/util.service';
import { Router } from '@angular/router';
import { MessageService } from './../../../core/service/message/message.service';
import { KolsService } from './../../../core/service/kols/kols.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-notes-list',
    templateUrl: './notes-list.component.html',
    styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent implements OnInit, OnDestroy {

    previousUrl: string;
    headerTitle = '';
    notesList: any = [];
    currentPage = 1;
    nextPage = false;
    isPageLoad: boolean;
    sortData: any = {
        type: '',
        sortBy: '',
    };
    isDataLoad = false;
    isLoadMore = false;

    constructor(
        private utilService: UtilService,
        private messageService: MessageService,
        private kolsService: KolsService,
        private location: Location,
        private zone: NgZone,
        private router: Router) {
        if (this.headerTitle === '') {
            this.headerTitle = localStorage.getItem('header_title');
        }
        localStorage.setItem('header_title', 'Notes');
        // this.zone.run(() => {
        this.messageService.setKolsData('Notes');
        // });
    }

    ngOnInit() {
       this.isPageLoad = false;
       this.previousUrl = this.utilService.previousUrl;
       this.getAllNotesList();
    }

    ngOnDestroy() {
        this.messageService.setKolsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);
    }

    /**
     * open note in editable view for edit
     */
    editNotes(item: any) {
        console.log(item);
        console.log('kol_id', item.kol_id);
        console.log('note_id', item.note_id);
        this.router.navigate([`${environment.appPrefix}/write-notes/${btoa(<any>item.kol_id)}/${btoa(<any>item.note_id)}`]);
    }

    /**
     * Get all existing notes list
     */
    getAllNotesList() {
        const postObj = {
            'page': this.currentPage,
            // 'name': false
        };

        if (this.sortData !== undefined && this.sortData !== '') {
            postObj['order'] = this.sortData.sortBy;
            if (this.sortData.type === 'name') {
                postObj['name'] = true;
            }
        }
        this.kolsService.getAllNotes(postObj)
        .then(res => {
            console.log(res);
            if (res['success']) {
                this.nextPage = res['data']['next_page'];
                if (this.nextPage) {
                    this.currentPage += 1;
                }

                for (const x of Object.keys(res['data']['data'])) {
                    this.notesList.push(res['data']['data'][x]);
                }

                console.log(this.notesList);
                if (this.notesList.length === 0) {
                    this.isPageLoad = true;
                }
                if (this.notesList.length > 0) {
                    this.isDataLoad = true;
                }
            }
            this.isLoadMore = false;
        }).catch(err => {
            this.isPageLoad = true;
            this.isLoadMore = false;
            console.log(err);
        });
    }

    /**
     * Load more data when user scroll
     * @param event
     */
    onScroll(event: any) {
        console.log(event);
       if (this.nextPage) {
            if (!this.isLoadMore) {
                this.messageService.setHttpLoaderStatus(false);
                this.isLoadMore = true;
                this.getAllNotesList();
            }
        }
    }

    goBack() {
        this.location.back();
    }

    /**
     * Load more data when user scroll
     * @param event
     */
    onScrollDown(event: any) {
        console.log('scrolled down!!', event);
        if (this.nextPage) {
            this.messageService.setHttpLoaderStatus(false);
            this.getAllNotesList();
        }
    }

    /**
     * Sort the selected column data
     * @param type: string
     */
    sortColumnData(type: string) {
        if (this.sortData === undefined && this.sortData === '') {
            this.sortData.type = type;
            this.sortData.sortBy = 'asc';
        } else {
            if (this.sortData.type !== type) {
                this.sortData.sortBy = '';
            }
            this.sortData.type = type;
            if (this.sortData.sortBy === 'asc') {
                this.sortData.sortBy = 'desc';
            } else {
                this.sortData.sortBy = 'asc';
            }
        }

        if (this.sortData !== undefined && this.sortData !== '') {
            this.notesList = [];
            this.currentPage = 1;
            this.messageService.setHttpLoaderStatus(true);
            this.getAllNotesList();
        }

    }

}
