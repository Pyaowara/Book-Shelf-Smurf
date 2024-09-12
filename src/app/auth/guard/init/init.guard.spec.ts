import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { initGuard } from './init.guard';

describe('initGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => initGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
