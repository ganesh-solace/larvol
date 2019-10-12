import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugSubscriptionDetailComponent } from './drug-subscription-detail.component';

describe('DrugSubscriptionDetailComponent', () => {
  let component: DrugSubscriptionDetailComponent;
  let fixture: ComponentFixture<DrugSubscriptionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugSubscriptionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugSubscriptionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
