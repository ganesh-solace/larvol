import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KolAdvanceSearchComponent } from './kol-advance-search.component';

describe('KolAdvanceSearchComponent', () => {
  let component: KolAdvanceSearchComponent;
  let fixture: ComponentFixture<KolAdvanceSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KolAdvanceSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KolAdvanceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
