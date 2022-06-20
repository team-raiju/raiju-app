import { TestBed } from '@angular/core/testing';

import { RaijuService } from './raiju.service';

describe('RaijuService', () => {
  let service: RaijuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaijuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
