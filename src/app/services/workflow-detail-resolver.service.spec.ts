import { TestBed, inject } from '@angular/core/testing';

import { WorkflowDetailResolver } from './workflow-detail-resolver.service';

describe('WorkflowDetailResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkflowDetailResolver]
    });
  });

  it('should be created', inject([WorkflowDetailResolver], (service: WorkflowDetailResolver) => {
    expect(service).toBeTruthy();
  }));
});
