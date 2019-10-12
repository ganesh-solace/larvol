import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-premium-counter-popup',
  templateUrl: './premium-counter-popup.component.html',
  styleUrls: ['./premium-counter-popup.component.scss']
})
export class PremiumCounterPopupComponent implements OnInit {
  @Input() count: string;
  @Input() entity: string;

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
