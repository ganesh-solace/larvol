import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KolsStarViewComponent } from './kols-star-view.component';

describe('KolsStarViewComponent', () => {
  let component: KolsStarViewComponent;
  let fixture: ComponentFixture<KolsStarViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KolsStarViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KolsStarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
