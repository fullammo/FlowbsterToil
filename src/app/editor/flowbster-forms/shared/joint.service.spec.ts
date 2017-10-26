import { TestBed, inject } from '@angular/core/testing';

import { JointService } from './joint.service';

describe('JointService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JointService]
    });
  });

  it('should be created', inject([JointService], (service: JointService) => {
    expect(service).toBeTruthy();
  }));
});
