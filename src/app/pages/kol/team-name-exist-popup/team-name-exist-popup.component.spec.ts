import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamNameExistPopupComponent } from './team-name-exist-popup.component';

describe('TeamNameExistPopupComponent', () => {
  let component: TeamNameExistPopupComponent;
  let fixture: ComponentFixture<TeamNameExistPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamNameExistPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamNameExistPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
