import { TestBed, inject } from '@angular/core/testing';

import { BreakoutService } from './breakout.service';

describe('BreakoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BreakoutService]
    });
  });

  it('should be created', inject([BreakoutService], (service: BreakoutService) => {
    expect(service).toBeTruthy();
  }));
});
