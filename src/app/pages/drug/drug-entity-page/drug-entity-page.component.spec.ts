import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugEntityPageComponent } from './drug-entity-page.component';

describe('DrugEntityPageComponent', () => {
  let component: DrugEntityPageComponent;
  let fixture: ComponentFixture<DrugEntityPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugEntityPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugEntityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
