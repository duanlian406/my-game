import { TestBed, inject } from '@angular/core/testing';

import { SnakeService } from './snake.service';

describe('SnakeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SnakeService]
    });
  });

  it('should be created', inject([SnakeService], (service: SnakeService) => {
    expect(service).toBeTruthy();
  }));
});
