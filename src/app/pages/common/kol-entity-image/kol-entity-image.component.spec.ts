import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KolEntityImageComponent } from './kol-entity-image.component';

describe('KolEntityImageComponent', () => {
  let component: KolEntityImageComponent;
  let fixture: ComponentFixture<KolEntityImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KolEntityImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KolEntityImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
