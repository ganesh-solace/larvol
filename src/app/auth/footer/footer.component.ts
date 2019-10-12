import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    currentYear: Number;

    constructor() { }

    ngOnInit() {
        const date = new Date();
        this.currentYear = date.getFullYear();
    }

}
