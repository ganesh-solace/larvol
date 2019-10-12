import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KolsLikesListComponent } from './kols-likes-list.component';

describe('KolsLikesListComponent', () => {
  let component: KolsLikesListComponent;
  let fixture: ComponentFixture<KolsLikesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KolsLikesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KolsLikesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
