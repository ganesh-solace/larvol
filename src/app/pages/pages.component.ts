import { Component, OnInit } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';
import { LarvolHttpInterceptor } from '../http-interceptor';

declare let ga: Function;
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  userId:any;
  usersData:any 
  userDetails:any;
  constructor(private router:Router) {
    this.usersData = localStorage.getItem('Kuser_data');  
    this.userDetails = JSON.parse(this.usersData)
    this.userId = this.userDetails.username 
    // Exclude the @LarvolHttpInterceptor.com user for GA tracking
    if (!this.userId.includes("@larvol.com")) {  
      this.router.events.subscribe(event => { 
        if (event instanceof NavigationEnd) {
          ga('set', 'userId', this.userId);
          ga('set', 'page', event.urlAfterRedirects);   
          ga('send', 'pageview');
        }
      });    
    }
  }

  ngOnInit() {
  }

}
