import { Component, OnInit, Input } from '@angular/core';
import { Deployment } from 'app/workflow/shared/deployment';
import { Experiment } from 'app/workflow/shared/experiment';
import { ExperimentService } from 'app/workflow/shared/experiment.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ManagerComponent } from 'app/workflow/shared/manager.component';
import { WorkflowEntry } from 'app/workflow/shared/workflowEntry';

/**
 * Holds the logic for interacting with the experiment child data table.
 */
@Component({
  selector: 'toil-experiment-manager',
  templateUrl: './experiment-manager.component.html',
  styleUrls: ['./experiment-manager.component.scss'],
  providers: [ExperimentService]
})
export class ExperimentManagerComponent extends ManagerComponent<
  Experiment,
  WorkflowEntry
> {
  /**
   * Initializes the needed services and calls the parent constructor.
   */
  constructor(private experimentSVC: ExperimentService) {
    super(experimentSVC);
  }
}
