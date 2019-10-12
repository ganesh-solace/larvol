import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-drug-attribute',
  templateUrl: './drug-attribute.component.html',
  styleUrls: ['./drug-attribute.component.scss']
})
export class DrugAttributeComponent implements OnInit {

  showDetail = true;
  @Input() set ProductData(value: any) {
    this.setProductData.next(value);
  }

  @Output() closeView: EventEmitter<any> = new EventEmitter<any>();

  productData: any = [];

  private readonly setProductData: ReplaySubject<string[]> = new ReplaySubject<string[]>();

  constructor(
    private router: Router,
    private location: Location,
  ) {
    // if (localStorage.getItem('kdrug_attribute') !== null || localStorage.getItem('kdrug_attribute') !== undefined) {
    //   this.productData = JSON.parse(localStorage.getItem('kdrug_attribute'));
    // }
  }

  ngOnInit() {
    this.setProductData.subscribe((res: any) => {
      this.productData = res;
    });
  }

  /**
   * Format the code name data
   * @param name: string
   */
  getCodeName(name: string) {
    if (name !== '' && name !== undefined && name !== null) {
      return name.trim();
    } else {
      return '';
    }
  }

  /**
   * Close the drug attribute expands view
   *
   * @memberof DrugAttributeComponent
   */
  closeDetailView() {
    localStorage.removeItem('showDrugDetail');
    this.closeView.next();
    // localStorage.removeItem('kdrug_attribute');
    // this.location.back();
  }

  /**
  * Redirect the user to Drug Landing page
  */
  redirectOnLandingPage() {
    localStorage.setItem('selectedEntity', 'drug');
    this.router.navigate(['/home']);
  }
}
