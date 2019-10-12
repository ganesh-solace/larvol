import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from './../../../core/service/user/user.service';
import { UtilService } from './../../../core/service/util.service';

@Component({
  selector: 'app-group-exist-modal',
  templateUrl: './group-exist-modal.component.html',
  styleUrls: ['./group-exist-modal.component.scss']
})
export class GroupExistModalComponent implements OnInit {

  @Input() group_name: string;

  postObj: any = {};
  constructor(
    private activeModal: NgbActiveModal,
    private userService: UserService,
    private utilService: UtilService,
  ) { }

  ngOnInit() {
  }

  /**
   * close active modal
   */
  closeModal() {
    this.activeModal.close();
  }

  /**
   * Add group function
   */

  addGroup() {
    console.log(this.group_name);

    this.postObj['name'] = this.group_name;
    this.postObj['force'] = true;

    this.userService.addGroup(this.postObj)
    .then(res => {
        if (res['success']) {
            console.log('res', res);
            this.utilService.showSuccess('Success', res['message']);
            this.activeModal.close('success');
        } else {
          this.utilService.showError('Error', res['errors']['name']);
        }
    }).catch(err => {
        // this.errorMsg = 'Something went wrong. Please try again later';
        console.log(err);
    });
  }

}
