import { TestBed } from '@angular/core/testing';

import { DeptIncentiveService } from './dept-incentive.service';

describe('DeptIncentiveService', () => {
  let service: DeptIncentiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeptIncentiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
