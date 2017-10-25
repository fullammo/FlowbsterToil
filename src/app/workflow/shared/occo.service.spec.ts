import { TestBed, inject } from '@angular/core/testing';

import { OccoService } from './occo.service';

describe('OccoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OccoService]
    });
  });

  it('should be created', inject([OccoService], (service: OccoService) => {
    expect(service).toBeTruthy();
  }));
});
