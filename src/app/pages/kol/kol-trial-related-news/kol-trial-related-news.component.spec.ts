import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KolTrialRelatedNewsComponent } from './kol-trial-related-news.component';

describe('KolTrialRelatedNewsComponent', () => {
  let component: KolTrialRelatedNewsComponent;
  let fixture: ComponentFixture<KolTrialRelatedNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KolTrialRelatedNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KolTrialRelatedNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
