import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugSearchResultListComponent } from './drug-search-result-list.component';

describe('DrugSearchResultListComponent', () => {
  let component: DrugSearchResultListComponent;
  let fixture: ComponentFixture<DrugSearchResultListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugSearchResultListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugSearchResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
