import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugSearchListComponent } from './drug-search-list.component';

describe('DrugSearchListComponent', () => {
  let component: DrugSearchListComponent;
  let fixture: ComponentFixture<DrugSearchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugSearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
