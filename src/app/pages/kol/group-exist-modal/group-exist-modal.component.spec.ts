import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupExistModalComponent } from './group-exist-modal.component';

describe('GroupExistModalComponent', () => {
  let component: GroupExistModalComponent;
  let fixture: ComponentFixture<GroupExistModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupExistModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupExistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
