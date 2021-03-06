import { OccoService } from './../shared/occo.service';
import { WorkflowEntry } from './../shared/workflowEntry';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DeploymentService } from 'app/workflow/shared/deployment.service';
import { Deployment } from 'app/workflow/shared/deployment';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ManagerComponent } from 'app/workflow/shared/manager.component';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';


/**
 * Holds logic of the datatable of the deployment records and its interactions.
 */
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
  /**
   * Emits informations outside of the component whenever the 'Eye' icon is clicked.
   */
  @Output() onWatchClicked = new EventEmitter<string>();

  /**
   * Initializes the used services. Propagates context information for the base class.
   * @param deploymentSVC
   * @param confirmSVC
   * @param occoSVC
   */
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

  /**
   * If the magnifies icon is clicked, the component emits information on its output.
   * @param entry
   */
  onMagnifierClicked(entry: Deployment) {
    this.onWatchClicked.emit(entry.graph);
  }

  /**
   * When the user clicks on the delete button, a confirmation dialog is shown wether you are
   * sure about deleting the record, if you confirm it, it gets removed from the database and also
   * Occopus tears the infrastructure down.
   * @param entry
   */
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
