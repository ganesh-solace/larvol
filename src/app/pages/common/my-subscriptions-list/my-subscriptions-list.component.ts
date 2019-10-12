import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from './../../../core/service/message/message.service';
import { UtilService } from './../../../core/service/util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from './../../../core/service/user/user.service';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupDeletePopupComponent } from '../../kol/group-delete-popup/group-delete-popup.component';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
    selector: 'app-my-subscriptions-list',
    templateUrl: './my-subscriptions-list.component.html',
    styleUrls: ['./my-subscriptions-list.component.scss']
})
export class MySubscriptionsListComponent implements OnInit, OnDestroy {

    groupForm: FormGroup;
    headerTitle = '';
    previousUrl: string;
    backTitle = 'Back to previous page';
    isHeaderShow = true;
    planList: any = [];
    groupList: any = [];
    loggedUserData: any;
    isLAPP = false;
    modalReference: any;
    isGroups = false;
    postObj: any = {};
    selected: any;
    existsMsg: any = '';
    isGroupLoad = false;
    userRef: any;

    constructor(
        private messageService: MessageService,
        private utilService: UtilService,
        private location: Location,
        private router: Router,
        private userService: UserService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute
    ) {
        if (this.headerTitle === '') {
            this.headerTitle = localStorage.getItem('header_title');
        }
        localStorage.setItem('header_title', 'My Subscription');
        this.messageService.setKolsData('My Subscription');
        this.userRef = this.messageService.getLoggedUserData().subscribe((res: any) => {
            console.log(res);
            this.loggedUserData = this.utilService.getLoggedUserData();
            if (this.loggedUserData !== null || this.loggedUserData !== undefined || this.loggedUserData !== '') {
                if (this.loggedUserData['organizations'].length === 0) {
                    this.isLAPP = true;
                }
            }
            if (this.isLAPP) {
                this.getSubscriptionPlanList('');
            } else {
                this.getSubscriptionPlanList('/teams');
            }
        });

        this.groupForm = this.formBuilder.group({
            groupName : [
                '',
                [
                    Validators.required,
                ]
            ]
        });

        this.activatedRoute.params.subscribe(params => {
            console.log('params', params);
            if (params) {
                this.selected = params.tab;
            }
        });
    }

    ngOnInit() {
        console.log('this.loggedUserData', this.loggedUserData);
        document.body.scrollTop = document.documentElement.scrollTop = 0;

        this.getGroupList();
    }

    ngOnDestroy() {
        this.messageService.setKolsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);

        if (!!this.userRef) {
            this.userRef.unsubscribe();
        }
    }

    goBack() {
        // this.location.back();
        this.router.navigate(['']);
    }

    goToBack(teamData: any) {
        console.log('teamData', teamData);
        console.log('this.loggedUserData', this.loggedUserData);
        localStorage.setItem('clicked_team', JSON.stringify(teamData));
        if (teamData.entity === 'KOLs') {
            this.router.navigate([`${environment.appPrefix}/subscription-detail`]);
        } else {
            console.log('Drug');
            this.router.navigate([`${environment.appPrefix}/drug-subscription-detail`]);
        }
    }

    /**
     * Get all existing subscriptions plan list and detail for same
     */
    getSubscriptionPlanList(teams: any) {
        this.planList = [];
        this.userService.getSubscriptionPlanList(teams)
        .then((res) => {
            console.log(res);
            if (res['success']) {
                if (this.isLAPP) {
                    console.log(res['data']['data']);
                    if (res['data']['data']['kol'] === undefined && res['data']['data']['drug'] === undefined) {
                        this.planList.push(res['data']['data']);
                    } else {
                        if (res['data']['data']['kol'] !== undefined) {
                            this.planList.push(res['data']['data']['kol']);
                        }
                        if (res['data']['data']['drug'] !== undefined) {
                            this.planList.push(res['data']['data']['drug']);
                        }
                    }
                } else {
                    this.planList = res['data'];
                    // if (res['data']['kols'] === undefined && res['data']['drugs'] === undefined) {
                    //     for (const x of Object.keys(res['data']['kols'])) {
                    //         this.planList.push(res['data']['kols'][x]);
                    //     }
                    // } else {
                    //     if (res['data']['kols'] !== undefined) {
                    //         for (const x of Object.keys(res['data']['kols'])) {
                    //             this.planList.push(res['data']['kols'][x]);
                    //         }
                    //     }
                    //     if (res['data']['drugs'] !== undefined) {
                    //         for (const x of Object.keys(res['data']['drugs'])) {
                    //             this.planList.push(res['data']['drugs'][x]);
                    //         }
                    //     }
                    // }
                    console.log(this.planList);
                }
                console.log('this.planList if', this.planList);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    /**
     * group delete modal
     */
    DeletePopup(item) {
        this.existsMsg = '';
        console.log('item', item);
        this.modalReference = this.modalService.open(GroupDeletePopupComponent, { windowClass: 'group-delete' });
        this.modalReference.componentInstance.group_id = item.id;
        this.modalReference.componentInstance.group_name = item.name;
        this.modalReference.result.then((result: any) => {
            console.log('Closed with:', result);
            if (result === 'success') {
                // this.messageService.setHttpLoaderStatus(false);
                this.getGroupList();
                this.groupForm.reset();
            }

        }, (reason: any) => {
            console.log(reason);
        });
    }

    /**
     * Get all existing group lists
     */
    getGroupList() {
        this.isGroupLoad = false;
        this.userService.getGroupList()
        .then((res) => {
            console.log('res group', res);
            if (res['success']) {
                if (res['data'].length > 0 ) {
                    this.groupList = res['data'];
                    console.log('this.groupList if', this.groupList);
                    this.isGroups = true;
                } else {
                    this.isGroups = false;
                }
            } else {
                this.isGroups = false;
            }
            this.isGroupLoad = true;
        }).catch((err) => {
            console.log(err);
            this.isGroupLoad = true;
        });
    }

    /**
     * Add group function
     */

    addGroup() {
        if (this.groupForm.valid) {
            this.messageService.setHttpLoaderStatus(true);
            console.log(this.groupForm.controls.groupName.value);

            this.postObj['name'] = this.groupForm.controls.groupName.value;

            this.userService.addGroup(this.postObj)
            .then(res => {
                if (res['success']) {
                    console.log('res', res);
                    this.utilService.showSuccess('Success', res['message']);
                    this.getGroupList();
                    this.groupForm.reset();
                } else {
                    if (res['message'] === 'Name exist') {
                        this.existsMsg = 'Name Exists';
                    } else {
                        this.utilService.showError('Error', res['message']);
                    }
                }
            }).catch(err => {
                this.groupForm.reset();
                console.log(err);
            });
        }
    }

    resetMsgonKey() {
        if (!this.groupForm.valid) {
            this.existsMsg = '';
        }
    }
}
