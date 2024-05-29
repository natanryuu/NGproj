import { TestBed } from '@angular/core/testing';

import { TablePreprojService } from './table-preproj.service';

describe('TablePreprojService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TablePreprojService = TestBed.get(TablePreprojService);
    expect(service).toBeTruthy();
  });
});
