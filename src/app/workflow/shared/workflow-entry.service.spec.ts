import { TestBed, inject } from '@angular/core/testing';

import { WorkflowEntryService } from './workflow-entry.service';

describe('WorkflowEntryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkflowEntryService]
    });
  });

  it('should be created', inject([WorkflowEntryService], (service: WorkflowEntryService) => {
    expect(service).toBeTruthy();
  }));
});
