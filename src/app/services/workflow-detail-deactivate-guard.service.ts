import { JointService } from 'app/editor/flowbster-forms/shared/joint.service';
import { DialogService } from './dialog.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { WorkflowEntry } from 'app/workflow/shared/workflowEntry';
import { WorkflowDetailComponent } from 'app/workflow/workflow-detail/workflow-detail.component';
import { WorkflowEntryService } from 'app/workflow/shared/workflow-entry.service';

/**
 * The Deactivation Guard service for the WorkflowDetailComponent.
 */
@Injectable()
export class WorkflowDetailDeactivateGuard
  implements CanDeactivate<WorkflowDetailComponent> {
  /**
   * Checks wether the Workflow entries properties or the associated graph has been edited.
   * If no changes were made its going to let you deactivate and refreshes the main workflow properties,
   * otherwise a confirmation dialog decides the next steps.
   * @param component WorkflowDetailComponent from where we dont want to let the user navigate away.
   * @param route
   * @param state
   */
  canDeactivate(
    component: WorkflowDetailComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    console.log('Deactivating...');

    const cleanEntry = this.workflowEntrySVC.initEntry(component.entry);
    const isPropertiesEdited = this.isEquivalent(
      component.starterEntry,
      cleanEntry
    );
    this.jointSVC.reinitializeWorkflow();

    if (component.isSubmitted) {
      return true;
    }

    if (isPropertiesEdited && !component.isGraphEdited) {
      return true;
    }

    const confirmObservable = this.dialogSVC.confirm('Discard Changes?');

    return confirmObservable;
  }

  /**
   * Checks if the 2 Workflow Entry is identical.
   * @param a A workflowEntry that is going to be compared
   * @param b A workflowEntry that is going to be compared
   * @returns Indicator deciding they are identical.
   */
  private isEquivalent(a: WorkflowEntry, b: WorkflowEntry): boolean {
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    if (aProps.length !== bProps.length) {
      return false;
    }

    for (let i = 0; i < aProps.length; i++) {
      const propName = aProps[i];
      if (a[propName] !== b[propName]) {
        return false;
      }
    }

    return true;
  }

  /**
   * We inject the needed services.
   * @param dialogSVC
   * @param jointSVC
   * @param workflowEntrySVC
   */
  constructor(
    private dialogSVC: DialogService,
    private jointSVC: JointService,
    private workflowEntrySVC: WorkflowEntryService
  ) {}
}
