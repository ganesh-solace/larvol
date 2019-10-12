import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumCounterPopupComponent } from './premium-counter-popup.component';

describe('PremiumCounterPopupComponent', () => {
  let component: PremiumCounterPopupComponent;
  let fixture: ComponentFixture<PremiumCounterPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumCounterPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumCounterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
