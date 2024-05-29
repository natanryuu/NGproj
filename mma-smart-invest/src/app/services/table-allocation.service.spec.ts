import { TestBed } from '@angular/core/testing';

import { TableAllocationService } from './table-allocation.service';

describe('TableAllocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TableAllocationService = TestBed.get(TableAllocationService);
    expect(service).toBeTruthy();
  });
});
