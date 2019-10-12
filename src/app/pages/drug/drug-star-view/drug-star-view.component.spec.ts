import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugStarViewComponent } from './drug-star-view.component';

describe('DrugStarViewComponent', () => {
  let component: DrugStarViewComponent;
  let fixture: ComponentFixture<DrugStarViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugStarViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugStarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
