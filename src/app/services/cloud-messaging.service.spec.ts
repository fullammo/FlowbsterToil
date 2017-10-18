import { TestBed, inject } from '@angular/core/testing';

import { CloudMessagingService } from './cloud-messaging.service';

describe('CloudMessagingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CloudMessagingService]
    });
  });

  it('should be created', inject([CloudMessagingService], (service: CloudMessagingService) => {
    expect(service).toBeTruthy();
  }));
});
