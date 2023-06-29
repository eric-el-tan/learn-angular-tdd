import { TestBed } from '@angular/core/testing';

import { FunderRuleService } from './funder-rule.service';

describe('FunderRuleService', () => {
  let service: FunderRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FunderRuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
