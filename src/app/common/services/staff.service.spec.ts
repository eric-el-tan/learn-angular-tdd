import { TestBed } from '@angular/core/testing';

import { PsHrService } from './staff.service';

describe('StaffService', () => {
  let service: PsHrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PsHrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
