import { TestBed } from '@angular/core/testing';

import { FightProcessService } from './fight-process.service';

describe('FightProcessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FightProcessService = TestBed.get(FightProcessService);
    expect(service).toBeTruthy();
  });
});
