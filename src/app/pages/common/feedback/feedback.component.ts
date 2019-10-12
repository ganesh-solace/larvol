import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { UtilService } from './../../../core/service/util.service';
import { Router } from '@angular/router';
import { MessageService } from './../../../core/service/message/message.service';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { UserService } from './../../../core/service/user/user.service';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit, OnDestroy {

    previousUrl: string;
    headerTitle = '';
    feedbackForm: FormGroup;
    @ViewChild('feedbackImage') feedbackImageRef: ElementRef;
    formData = new FormData();

    constructor(
        private utilService: UtilService,
        private messageService: MessageService,
        private location: Location,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private router: Router) {
        if (this.headerTitle === '') {
            this.headerTitle = localStorage.getItem('header_title');
        }

        localStorage.setItem('header_title', 'Feedback');
        this.messageService.setKolsData('Feedback');

        this.feedbackForm = this.formBuilder.group({
            feedback: ['', [Validators.required]],
            image: [''],
        });
    }

    ngOnInit() {
        this.previousUrl = this.utilService.previousUrl;
        if (localStorage.getItem('kfeedback_text') !== null || localStorage.getItem('kfeedback_text') !== undefined) {
            this.feedbackForm.controls.feedback.setValue(localStorage.getItem('kfeedback_text'));
        }
    }

    ngOnDestroy() {
        this.messageService.setKolsData(this.headerTitle);
        localStorage.setItem('header_title', this.headerTitle);
        if (this.feedbackForm.value.feedback !== '' && this.feedbackForm.value.feedback !== null) {
            localStorage.setItem('kfeedback_text', this.feedbackForm.value.feedback);
        } else {
            localStorage.removeItem('kfeedback_text');
        }
    }

    goBack() {
        this.location.back();
    }

    triggerUpload() {
        this.feedbackImageRef.nativeElement.click();
    }

    /**
	 * Upload feedback image
	 * @param event <any>
	 */
    uploadFeedbackPic(event: any) {
        const srcEle = event.srcElement;
        if (srcEle.files && srcEle.files[0]) {
            this.feedbackForm.controls.image.setValue(srcEle.files[0].name);
            this.formData.append('image', srcEle.files[0]);
        }
    }

    /**
     * submit feedback data
     */
    submitFeedback() {
        if (this.feedbackForm.valid) {
            this.formData.append('feedback', this.feedbackForm.value.feedback);
            this.userService.sendFeedback(this.formData)
            .then(res => {
                if (res['success']) {
                    this.feedbackForm.value.feedback = '';
                    localStorage.removeItem('kfeedback_text');
                    this.utilService.showSuccess('Success', 'Feedback submitted successfully!');
                    this.router.navigate(['']);
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }
}
