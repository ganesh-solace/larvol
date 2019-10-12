import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugRequestSubmissionComponent } from './drug-request-submission.component';

describe('DrugComponent', () => {
  let component: DrugRequestSubmissionComponent;
  let fixture: ComponentFixture<DrugRequestSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugRequestSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugRequestSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
