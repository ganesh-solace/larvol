import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugNotesComponent } from './drug-notes.component';

describe('DrugNotesComponent', () => {
  let component: DrugNotesComponent;
  let fixture: ComponentFixture<DrugNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
