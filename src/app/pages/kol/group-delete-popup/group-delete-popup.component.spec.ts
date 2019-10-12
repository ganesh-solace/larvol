import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDeletePopupComponent } from './group-delete-popup.component';

describe('GroupDeletePopupComponent', () => {
  let component: GroupDeletePopupComponent;
  let fixture: ComponentFixture<GroupDeletePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupDeletePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
