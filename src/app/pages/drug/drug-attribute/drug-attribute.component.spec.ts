import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugAttributeComponent } from './drug-attribute.component';

describe('DrugAttributeComponent', () => {
  let component: DrugAttributeComponent;
  let fixture: ComponentFixture<DrugAttributeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugAttributeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
