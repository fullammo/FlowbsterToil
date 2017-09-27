import { WorkflowEntryService } from 'app/services/workflow-entry.service';
import { JointService } from './../editor/shared/joint.service';
import { WorkflowEntry } from 'app/view-models/workflowEntry';
import { DialogService } from './dialog.service';
import { WorkflowDetailComponent } from 'app/workflow-detail/workflow-detail.component';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class WorkflowDetailDeactivateGuard implements CanDeactivate<WorkflowDetailComponent> {

  canDeactivate(component: WorkflowDetailComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {

    console.log('Deactivating...');

    const cleanEntry = this.workflowEntrySVC.initEntry(component.entry);
    const isPropertiesEdited = this.isEquivalent(component.starterEntry, cleanEntry);
    this.jointSVC.reinitializeWorkflow();

    if (isPropertiesEdited && !component.isGraphEdited) {
      return true;
    }

    const confirmObservable = this.dialogSVC.confirm('Discard Changes?');

    return confirmObservable;
  }

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

  constructor(private dialogSVC: DialogService, private jointSVC: JointService, private workflowEntrySVC: WorkflowEntryService) {

  }

}
