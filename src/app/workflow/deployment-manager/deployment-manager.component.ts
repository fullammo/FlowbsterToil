import { WorkflowEntry } from './../shared/workflowEntry';
import { Component, OnInit, Input } from '@angular/core';
import { DeploymentService } from 'app/workflow/shared/deployment.service';
import { Deployment } from 'app/workflow/shared/deployment';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'toil-deployment-manager',
  templateUrl: './deployment-manager.component.html',
  styleUrls: ['./deployment-manager.component.scss'],
  providers: [DeploymentService]
})
export class DeploymentManagerComponent implements OnInit, OnDestroy {
  @Input() contextEntry: WorkflowEntry;

  deployments: Deployment[];
  selectedDeployments: Deployment[];

  constructor(private deploymentSVC: DeploymentService) {}

  ngOnInit() {
    this.deploymentSVC.subscribeToDataChanges(this.contextEntry.$key);
    this.deploymentSVC.dataChange.subscribe(deployments => {
      this.deployments = deployments;
    });
  }

  ngOnDestroy() {
    this.deploymentSVC.subscription.unsubscribe();
  }
}
