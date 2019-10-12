import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetSuccessfullyComponent } from './reset-successfully.component';

describe('ResetSuccessfullyComponent', () => {
  let component: ResetSuccessfullyComponent;
  let fixture: ComponentFixture<ResetSuccessfullyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetSuccessfullyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetSuccessfullyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
