import { TestBed } from '@angular/core/testing';

import { PsHrService } from './ps-hr.service';

describe('PsHrService', () => {
  let service: PsHrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PsHrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
