import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-premium-kol-popup',
    templateUrl: './premium-kol-popup.component.html',
    styleUrls: ['./premium-kol-popup.component.scss']
})
export class PremiumKolPopupComponent implements OnInit {

    @Input() message: string;

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
