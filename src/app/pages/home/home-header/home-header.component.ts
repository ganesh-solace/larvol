import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
    selector: 'app-home-header',
    templateUrl: './home-header.component.html',
    styleUrls: ['./home-header.component.scss']
})
export class HomeHeaderComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        if ($('.prefix_banner-container').length > 0) {
            $('body').addClass('omni-landing');
        }
    }

}
