import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesDeletePopupComponent } from './notes-delete-popup.component';

describe('NotesDeletePopupComponent', () => {
  let component: NotesDeletePopupComponent;
  let fixture: ComponentFixture<NotesDeletePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesDeletePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
