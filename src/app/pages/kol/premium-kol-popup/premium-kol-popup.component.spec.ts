import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumKolPopupComponent } from './premium-kol-popup.component';

describe('PremiumKolPopupComponent', () => {
  let component: PremiumKolPopupComponent;
  let fixture: ComponentFixture<PremiumKolPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumKolPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumKolPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
