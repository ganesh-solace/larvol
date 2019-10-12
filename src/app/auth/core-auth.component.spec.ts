import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreAuthComponent } from './core-auth.component';

describe('CoreAuthComponent', () => {
  let component: CoreAuthComponent;
  let fixture: ComponentFixture<CoreAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
