import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkKolsComponent } from './bookmark-kols.component';

describe('BookmarkKolsComponent', () => {
  let component: BookmarkKolsComponent;
  let fixture: ComponentFixture<BookmarkKolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkKolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkKolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
