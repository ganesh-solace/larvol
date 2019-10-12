import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugRequestComponent } from './drug-request.component';

describe('DrugRequestComponent', () => {
  let component: DrugRequestComponent;
  let fixture: ComponentFixture<DrugRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
