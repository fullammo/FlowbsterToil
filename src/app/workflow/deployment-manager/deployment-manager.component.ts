import { WorkflowEntry } from './../shared/workflowEntry';
import { Component, OnInit, Input } from '@angular/core';
import { DeploymentService } from 'app/workflow/shared/deployment.service';
import { Deployment } from 'app/workflow/shared/deployment';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ManagerComponent } from 'app/workflow/shared/manager.component';

@Component({
  selector: 'toil-deployment-manager',
  templateUrl: './deployment-manager.component.html',
  styleUrls: ['./deployment-manager.component.scss'],
  providers: [DeploymentService]
})
export class DeploymentManagerComponent extends ManagerComponent<
  Deployment,
  WorkflowEntry
> {
  constructor(private deploymentSVC: DeploymentService) {
    super(deploymentSVC);
  }
}
