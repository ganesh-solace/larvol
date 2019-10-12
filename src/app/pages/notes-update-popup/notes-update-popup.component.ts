import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { KolsService } from './../../core/service/kols/kols.service';
import { UtilService } from './../../core/service/util.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-notes-update-popup',
    templateUrl: './notes-update-popup.component.html',
    styleUrls: ['./notes-update-popup.component.scss']
})
export class NotesUpdatePopupComponent implements OnInit {

    @Input() noteData: any;

    noteForm: FormGroup;
    contentLength = 1000;
    noteText = '';

    constructor(
        private formBuilder: FormBuilder,
        private kolsService: KolsService,
        private utilService: UtilService,
        private activeModal: NgbActiveModal
    ) {
        this.noteForm = this.formBuilder.group({
            content: ['', [Validators.required]],
            title: ['', [Validators.required]]
        });
    }

    /**
     * This function will call when component is load first time
     */
    ngOnInit() {
        console.log(this.noteData);
        if (this.noteData !== undefined) {
            this.noteForm.patchValue({
                content: this.noteData.content,
                title: this.noteData.title,
            });
            this.noteText = this.noteData.content;
        }
    }

    /**
     * Close the active modal
     */
    closeModal(type: string) {
        this.activeModal.close(type);
    }

    /**
     * Update the existing note data by note id
     */
    updateNote() {
        console.log(this.noteForm.value);
        if (this.noteForm.valid) {
            Object.keys(this.noteForm.value).filter(x => x.trim());
            const data: any = {
                'content': this.noteForm.value['content'].trim(),
                'title': this.noteForm.value['title'].trim(),
            };
            this.kolsService.updateNewNote(data, this.noteData.id)
                .then(res => {
                    if (res['success']) {
                        this.noteForm.controls.content.setValue('');
                        this.noteText = '';
                        this.utilService.showSuccess('Success', res['message']);
                        this.activeModal.close('update');
                    } else {
                        this.utilService.showSuccess('Error', res['message']);
                    }
                }).catch(err => {
                    this.utilService.showError('Error', err['error']['message']);
                });
        } else {
            (Object).values(this.noteForm.controls).forEach((control) => {
                control.markAsTouched();
            });
        }
    }

}
