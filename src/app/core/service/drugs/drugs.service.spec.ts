import { TestBed } from '@angular/core/testing';

import { DrugsService } from './drugs.service';

describe('DrugsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrugsService = TestBed.get(DrugsService);
    expect(service).toBeTruthy();
  });
});
