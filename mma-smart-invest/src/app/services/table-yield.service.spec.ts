import { TestBed } from '@angular/core/testing';

import { TableYieldService } from './table-yield.service';

describe('TableYieldService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TableYieldService = TestBed.get(TableYieldService);
    expect(service).toBeTruthy();
  });
});
