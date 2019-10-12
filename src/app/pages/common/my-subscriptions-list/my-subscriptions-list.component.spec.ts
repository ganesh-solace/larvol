import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySubscriptionsListComponent } from './my-subscriptions-list.component';

describe('MySubscriptionsListComponent', () => {
  let component: MySubscriptionsListComponent;
  let fixture: ComponentFixture<MySubscriptionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySubscriptionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySubscriptionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
