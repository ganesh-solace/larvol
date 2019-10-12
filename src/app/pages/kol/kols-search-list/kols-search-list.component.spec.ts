import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KolsSearchListComponent } from './kols-search-list.component';

describe('KolsSearchListComponent', () => {
  let component: KolsSearchListComponent;
  let fixture: ComponentFixture<KolsSearchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KolsSearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KolsSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
