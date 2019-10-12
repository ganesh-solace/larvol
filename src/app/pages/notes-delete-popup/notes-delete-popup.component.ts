import { Component, OnInit, Input } from '@angular/core';
import { KolsService } from './../../core/service/kols/kols.service';
import { UtilService } from './../../core/service/util.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-notes-delete-popup',
    templateUrl: './notes-delete-popup.component.html',
    styleUrls: ['./notes-delete-popup.component.scss']
})
export class NotesDeletePopupComponent implements OnInit {

    @Input() noteData: any;

    constructor(
        private kolsService: KolsService,
        private utilService: UtilService,
        private activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
    }
/**
     * Close the active modal
     */
    closeModal(type: string) {
        this.activeModal.close(type);
    }

    /**
     * Delete selected note data
     */
    deleteNote() {
        this.kolsService.deleteNewNote(this.noteData.id)
        .then(res => {
            if (res['success']) {
                this.utilService.showSuccess('Success', res['message']);
                this.activeModal.close('delete');
            } else {
                this.utilService.showSuccess('Error', res['message']);
            }
        }).catch(err => {
            this.utilService.showError('Error', err['error']['message']);
        });
    }

}
