import { TestBed } from '@angular/core/testing';

import { BmsapiService } from './bmsapi.service';

describe('BmsapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BmsapiService = TestBed.get(BmsapiService);
    expect(service).toBeTruthy();
  });
});
