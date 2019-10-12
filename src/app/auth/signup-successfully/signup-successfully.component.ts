import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signup-successfully',
    templateUrl: './signup-successfully.component.html',
    styleUrls: ['./signup-successfully.component.scss']
})
export class SignupSuccessfullyComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {
        setTimeout(() => {
           this.router.navigate(['']);
        }, 4000);
    }

}
