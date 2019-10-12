import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesUpdatePopupComponent } from './notes-update-popup.component';

describe('NotesUpdatePopupComponent', () => {
  let component: NotesUpdatePopupComponent;
  let fixture: ComponentFixture<NotesUpdatePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesUpdatePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesUpdatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
