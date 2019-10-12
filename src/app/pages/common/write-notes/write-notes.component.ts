import { Component, OnInit, OnDestroy } from '@angular/core';
import { UtilService } from './../../../core/service/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './../../../core/service/message/message.service';
import { UserService } from './../../../core/service/user/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { KolsService } from './../../../core/service/kols/kols.service';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { NotesDeletePopupComponent } from '../../notes-delete-popup/notes-delete-popup.component';
import { NotesUpdatePopupComponent } from '../../notes-update-popup/notes-update-popup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-write-notes',
    templateUrl: './write-notes.component.html',
    styleUrls: ['./write-notes.component.scss']
})
export class WriteNotesComponent implements OnInit, OnDestroy {
    modalReference: any;
    previousUrl: string;
    notes = '';
    noteId = 0;
    headerTitle = '';
    noteForm: FormGroup;
    kolId = 0;
    isNoteExist = false;
    allNoteList: any = [];
    placeholder = '';
    contentLength = 1000;
    noteText = '';
    editText = '- edited';
    lastEditedNoteData: any;

    constructor(
        private utilService: UtilService,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService,
        private userService: UserService,
        private kolsService: KolsService,
        private formBuilder: FormBuilder,
        private location: Location,
        private router: Router,
        private modalService: NgbModal,
    ) {
        this.noteForm = this.formBuilder.group({
            content: ['', [Validators.required, Validators.maxLength(this.contentLength)]],
            title: ['', [Validators.required]]
        });
        this.activatedRoute.params.subscribe(data => {
            console.log(data);
            if (data.hasOwnProperty('id')) {
                this.noteId = <any>atob(data.id);
                this.kolId = <any>atob(data['kol_id']);
                if (this.headerTitle === '') {
                    this.headerTitle = localStorage.getItem('header_title');
                    this.noteForm.controls.title.setValue(this.headerTitle);
                }
            }
        });
    }

    ngOnInit() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.messageService.setHttpLoaderStatus(true);
        if (this.kolId > 0) {
            this.getNotesByKOlId();
            this.getKolsDetailData();
        }

        if (this.noteId > 0) {
            const item = {
                id: this.noteId
            };
            this.editNotes(item);
        }
    }

    ngOnDestroy() {
        this.messageService.setKolsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);
    }

     /**
    * Get KOL detail data by KOL id
    */
   getKolsDetailData() {
    this.kolsService.getKOLsDetailData(this.kolId)
        .then((res: any) => {
            if (res['success']) {
                if (res.data.data.kol_full_name !== null) {
                    this.noteForm.controls.title.setValue(res.data.data.kol_full_name);
                    if (this.router.url !== '/home') {
                        localStorage.setItem('header_title', res.data.data.kol_full_name);
                        this.messageService.setKolsData(res.data.data.kol_full_name);
                    }
                }
            }
        }).catch(err => {
            console.log(err);
        });
}

    /**
    * Get note data by kol is note exist
    */
    getNotesByKOlId() {
        this.kolsService.getNotesByKOlId(this.kolId)
            .then((res: any) => {
                console.log(res);
                if (res['success']) {
                    if (res.data.length > 0) {
                        this.allNoteList = res.data;
                    }
                }
                this.placeholder = 'Write note here';
            }).catch(err => {
                console.log(err);
                this.placeholder = 'Write note here';
            });
    }

    /**
    * Save/Update note by KOl Id
    */
    saveNote(isMsg = '') {
        if (this.noteForm.valid && this.noteText.trim() !== '' && this.noteForm.value['title'] !== null) {
            this.messageService.setHttpLoaderStatus(true);
            this.lastEditedNoteData = '';
            Object.keys(this.noteForm.value).filter(x => x.trim());
            console.log('this.noteForm.value', this.noteForm.value['content']);
            const data: any = {
                'content': this.noteForm.value['content'].trim(),
                'title': this.noteForm.value['title'].trim(),
            };
            this.kolsService.saveNewNote(data, this.kolId)
                .then(res => {
                    console.log(res);
                    if (res['success'] && isMsg === '') {
                        this.noteForm.controls.content.setValue('');
                        this.noteText = '';
                        this.placeholder = 'Write note here';
                        this.allNoteList = [];
                        this.getNotesByKOlId();
                        this.utilService.showSuccess('Success', res['message']);
                    } else if (isMsg === '') {
                        this.utilService.showSuccess('Error', res['message']);
                    }
                    (Object).values(this.noteForm.controls).forEach((control) => {
                        control.markAsUntouched();
                    });
                }).catch(err => {
                    (Object).values(this.noteForm.controls).forEach((control) => {
                        control.markAsUntouched();
                    });
                    this.utilService.showError('Error', err['error']['message']);
                });
        } else {
            // this.noteForm.controls.content.setValue('');
            (Object).values(this.noteForm.controls).forEach((control) => {
                control.markAsTouched();
            });
        }
    }

    gotoNoteListing() {
        this.router.navigate([`${environment.appPrefix}/notes-list`]);
    }

    cancelClick() {
        console.log('cancel click');
        this.location.back();
        // this.noteForm.controls.content.setValue('');
        // this.noteText = '';
    }

    goBack() {
        this.location.back();
    }

    /**
     * delete the selected note data
     * @param item: any
     */
    deleteNotes(item: any) {
        console.log(item);
        this.modalReference = this.modalService.open(NotesDeletePopupComponent, { windowClass: 'edit_notes' });
        this.modalReference.componentInstance.noteData = item;
        this.modalReference.result.then((result: any) => {
            console.log(`Closed with: ${result}`);
            if (result === 'delete') {
                this.allNoteList = [];
                this.getNotesByKOlId();
            }
        }, (reason: any) => {
            console.log(reason);
        });
    }

    /**
     * Open edit view of selected note
     * @param item: any
     */
    editNotes(item: any) {
        this.kolsService.getNotesByNoteId(item.id)
        .then((res: any) => {
            if (res.success) {
                this.modalReference = this.modalService.open(NotesUpdatePopupComponent, { windowClass: 'edit_notes_popup' });
                this.modalReference.componentInstance.noteData = res.data;
                this.modalReference.result.then((result: any) => {
                    console.log(`Closed with: ${result}`);
                    if (result === 'update') {
                        this.lastEditedNoteData = res.data;
                        this.allNoteList = [];
                        this.getNotesByKOlId();
                    }
                }, (reason: any) => {
                    console.log(reason);
                });
            } else {
                this.utilService.showSuccess('Error', res['message']);
            }
        }).catch((err: any) => {
            console.log(err);
        });
    }

    getReamaningLength() {
        let length = 0;
        length = this.contentLength - this.noteText.length;
        if (length > 0) {
            return length;
        } else {
            return 0;
        }
    }

}
