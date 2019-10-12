import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KolRequestSubmissionComponent } from './kol-request-submission.component';

describe('KolRequestSubmissionComponent', () => {
  let component: KolRequestSubmissionComponent;
  let fixture: ComponentFixture<KolRequestSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KolRequestSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KolRequestSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
