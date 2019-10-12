import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from './../../../core/service/user/user.service';
import { UtilService } from './../../../core/service/util.service';
import { MessageService } from './../../../core/service/message/message.service';

@Component({
  selector: 'app-group-delete-popup',
  templateUrl: './group-delete-popup.component.html',
  styleUrls: ['./group-delete-popup.component.scss']
})
export class GroupDeletePopupComponent implements OnInit {

  @Input() group_id: string;
  @Input() group_name: string;

  constructor(
    private activeModal: NgbActiveModal,
    private userService: UserService,
    private utilService: UtilService,
    private messageService: MessageService,
  ) {
   }

  ngOnInit() {
  }

  /**
   * close active modal
   */
  closeModal() {
    this.activeModal.close();
  }

  /**
   * delete the specific group
   */
  deleteGroup() {
    console.log('group_id', this.group_id);

    this.messageService.setHttpLoaderStatus(true);
    this.userService.removeGroupById(this.group_id)
    .then((res: any) => {
        if (res['success']) {
          this.utilService.showSuccess('Success', res['message']);
          this.messageService.setHttpLoaderStatus(false);
          this.activeModal.close('success');
        } else {
          this.utilService.showError('Error', res['message']);
        }
    }).catch((err: any) => {
        console.log(err);
        this.utilService.showError('Error', err['message']);
    });
  }

}
