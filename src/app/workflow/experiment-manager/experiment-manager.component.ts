import { Component, OnInit, Input } from '@angular/core';
import { Deployment } from 'app/workflow/shared/deployment';
import { Experiment } from 'app/workflow/shared/experiment';
import { ExperimentService } from 'app/workflow/shared/experiment.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'toil-experiment-manager',
  templateUrl: './experiment-manager.component.html',
  styleUrls: ['./experiment-manager.component.scss'],
  providers: [ExperimentService]
})
export class ExperimentManagerComponent implements OnInit, OnDestroy {
  @Input() contextEntry: Deployment;

  experiments: Experiment[];
  selectedExperiments: Experiment[];

  constructor(private experimentSVC: ExperimentService) {}

  ngOnInit() {
    this.experimentSVC.subscribeToDeploymentChanges(this.contextEntry);
    this.experimentSVC.dataChange.subscribe(experiments => {
      this.experiments = experiments;
    });
  }

  ngOnDestroy() {
    this.experimentSVC.subscription.unsubscribe();
  }
}
