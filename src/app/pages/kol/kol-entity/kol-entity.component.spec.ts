import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KolEntityComponent } from './kol-entity.component';

describe('KolEntityComponent', () => {
  let component: KolEntityComponent;
  let fixture: ComponentFixture<KolEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KolEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KolEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
