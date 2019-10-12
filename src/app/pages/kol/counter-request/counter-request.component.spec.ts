import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterRequestComponent } from './counter-request.component';

describe('CounterRequestComponent', () => {
  let component: CounterRequestComponent;
  let fixture: ComponentFixture<CounterRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CounterRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
