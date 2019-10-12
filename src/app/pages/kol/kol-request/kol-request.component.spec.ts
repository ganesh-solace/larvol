import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KolRequestComponent } from './kol-request.component';

describe('KolRequestComponent', () => {
  let component: KolRequestComponent;
  let fixture: ComponentFixture<KolRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KolRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KolRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
