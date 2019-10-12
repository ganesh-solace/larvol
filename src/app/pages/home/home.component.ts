import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
declare var $: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    cookieValue = '';
    cookieName = 'cookie-accepted';
    isShow = true;
    constructor(private cookieService: CookieService) { }

    ngOnInit() {
        this.cookieValue = this.cookieService.get(this.cookieName);
        if (this.cookieValue !== '') {
            this.isShow = false;
        }
        console.log(this.cookieValue);
        if ($(".prefix_banner-container").length > 0) {
            $("body").addClass('omni-landing');
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
