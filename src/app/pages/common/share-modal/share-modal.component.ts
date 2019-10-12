import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;

@Component({
    selector: 'app-share-modal',
    templateUrl: './share-modal.component.html',
    styleUrls: ['./share-modal.component.scss']
})
export class ShareModalComponent implements OnInit  {
    @Input() url: string;
    @Input() title: string;

    href = '';
    original_referer = encodeURI(location.href);
    mailBody = '';

    constructor(private activeModal: NgbActiveModal) {
        
    }

    ngOnInit() {
        // console.log(this.url);
        // mailurl = mailurl.replace(/?/g, '%3F');
        this.mailBody = this.title + ' \n \n ' + this.url;
        this.mailBody = encodeURIComponent(this.mailBody);
        this.href = this.url;
        const self = this;
        $(document).ready(function() {
            $('.share-icon').click(function(e) {
                e.preventDefault();
                if ($(this).attr('href') !== 'javascript:void(0)') {
                    // tslint:disable-next-line:max-line-length
                    window.open($(this).attr('href'), 'fbShareWindow', 'height=400, width=700, top=' + ($(window).height() / 2 - 200) + ', left=' + ($(window).width() / 2 - 225) + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
                }
                setTimeout(() => {
                    self.activeModal.close('success');
                }, 500);
                return false;
            });
        });
    }

    /**
     * close active modal
     */
    closeModal() {
        this.activeModal.close();
    }

    copyToClipboard(item) {
        document.addEventListener('copy', (e: ClipboardEvent) => {
          e.clipboardData.setData('text/plain', (item));
          e.preventDefault();
          document.removeEventListener('copy', null);
        });
        document.execCommand('copy');
    }

    /**
     * close share popup when click on email share icon
     */
    clickOnEmailShare() {
        setTimeout(() => {
            this.activeModal.close('success');
        }, 1000);
    }
}


