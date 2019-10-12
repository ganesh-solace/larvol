import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
declare var $: any;

@Component({
    selector: 'app-home-footer',
    templateUrl: './home-footer.component.html',
    styleUrls: ['./home-footer.component.scss']
})
export class HomeFooterComponent implements OnInit {

    cookieValue = '';
    cookieName = 'cookie-accepted';
    isShow = true;
    constructor(private cookieService: CookieService) { }

    ngOnInit() {
        this.cookieValue = this.cookieService.get(this.cookieName);
        if (this.cookieValue !== '') {
            this.isShow = false;
        }

        $(document).ready(function () {
            $('#nav-icon4').click(function () {
                $(this).toggleClass('open');
            });
        });
    }

    acceptCookie() {
        this.cookieService.set( this.cookieName, 'accepted' );
        this.cookieValue = this.cookieService.get(this.cookieName);
        if (this.cookieValue !== '') {
            this.isShow = false;
        }
    }

    close() {
        this.isShow = false;
    }

}
