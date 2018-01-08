import { OccoService } from './../shared/occo.service';
import { WorkflowEntry } from './../shared/workflowEntry';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DeploymentService } from 'app/workflow/shared/deployment.service';
import { Deployment } from 'app/workflow/shared/deployment';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ManagerComponent } from 'app/workflow/shared/manager.component';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';

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
  @Output() onWatchClicked = new EventEmitter<string>();

  constructor(
    private deploymentSVC: DeploymentService,
    private confirmSVC: ConfirmationService,
    private occoSVC: OccoService
  ) {
    super(deploymentSVC);
  }

  /**
   * To be decided how do we wanna edit a node.
   * @param entry
   */
  onEditClicked(entry: Deployment) {
    console.log(entry);
  }

  onMagnifierClicked(entry: Deployment) {
    this.onWatchClicked.emit(entry.graph);
  }

  confirmDeletion(entry: Deployment) {
    this.confirmSVC.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.occoSVC.destroyWorkflow(entry.infraid);
        // only delete the entry when the workflow is actually destroyed
        this.deploymentSVC.deleteEntry(entry.$key);
      }
    });
  }
}
