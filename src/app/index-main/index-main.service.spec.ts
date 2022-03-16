import { TestBed } from '@angular/core/testing';

import { IndexMainService } from './index-main.service';

describe('IndexMainService', () => {
  let service: IndexMainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexMainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
