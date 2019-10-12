import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-team-name-exist-popup',
    templateUrl: './team-name-exist-popup.component.html',
    styleUrls: ['./team-name-exist-popup.component.scss']
})
export class TeamNameExistPopupComponent implements OnInit {

    constructor(
        private activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
    }

    /**
     * close active modal
     */
    closeModal() {
        this.activeModal.close();
    }

}
