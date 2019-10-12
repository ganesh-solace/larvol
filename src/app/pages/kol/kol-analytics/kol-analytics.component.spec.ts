import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KolAnalyticsComponent } from './kol-analytics.component';

describe('KolAnalyticsComponent', () => {
  let component: KolAnalyticsComponent;
  let fixture: ComponentFixture<KolAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KolAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KolAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
