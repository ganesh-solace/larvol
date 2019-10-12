import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugTrialRelatedNewsComponent } from './drug-trial-related-news.component';

describe('DrugTrialRelatedNewsComponent', () => {
  let component: DrugTrialRelatedNewsComponent;
  let fixture: ComponentFixture<DrugTrialRelatedNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugTrialRelatedNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugTrialRelatedNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
