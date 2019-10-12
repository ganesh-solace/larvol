import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupSuccessfullyComponent } from './signup-successfully.component';

describe('SignupSuccessfullyComponent', () => {
  let component: SignupSuccessfullyComponent;
  let fixture: ComponentFixture<SignupSuccessfullyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupSuccessfullyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupSuccessfullyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
