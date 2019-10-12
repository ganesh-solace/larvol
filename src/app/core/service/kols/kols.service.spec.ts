import { TestBed } from '@angular/core/testing';

import { KolsService } from './kols.service';

describe('KolsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KolsService = TestBed.get(KolsService);
    expect(service).toBeTruthy();
  });
});
