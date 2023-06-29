import { TestBed } from '@angular/core/testing';

import { NamedStaffService } from './named-staff.service';

describe('NamedStaffService', () => {
  let service: NamedStaffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NamedStaffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
