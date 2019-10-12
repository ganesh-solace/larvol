import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugLandingPageComponent } from './drug-landing-page.component';

describe('DrugLandingPageComponent', () => {
  let component: DrugLandingPageComponent;
  let fixture: ComponentFixture<DrugLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
