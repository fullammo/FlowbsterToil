import { TestBed, inject } from '@angular/core/testing';

import { WorkflowDetailDeactivateGuard } from './workflow-detail-deactivate-guard.service';

describe('WorkflowDetailDeactivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkflowDetailDeactivateGuard]
    });
  });

  it('should be created', inject([WorkflowDetailDeactivateGuard], (service: WorkflowDetailDeactivateGuard) => {
    expect(service).toBeTruthy();
  }));
});
