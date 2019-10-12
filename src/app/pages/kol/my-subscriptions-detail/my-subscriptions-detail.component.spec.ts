import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySubscriptionsDetailComponent } from './my-subscriptions-detail.component';

describe('MySubscriptionsDetailComponent', () => {
  let component: MySubscriptionsDetailComponent;
  let fixture: ComponentFixture<MySubscriptionsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySubscriptionsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySubscriptionsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
