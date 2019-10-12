import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsSocialFeaturesComponent } from './news-social-features.component';

describe('NewsSocialFeaturesComponent', () => {
  let component: NewsSocialFeaturesComponent;
  let fixture: ComponentFixture<NewsSocialFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsSocialFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsSocialFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
