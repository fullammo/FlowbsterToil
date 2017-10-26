import { TestBed, inject } from '@angular/core/testing';

import { DescriptorService } from './descriptor.service';

describe('DescriptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DescriptorService]
    });
  });

  it('should be created', inject([DescriptorService], (service: DescriptorService) => {
    expect(service).toBeTruthy();
  }));
});
