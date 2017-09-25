import { WorkflowEntryService } from './workflow-entry.service';
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
    if (this.isEquivalent(component.starterEntry, component.workflowEntrySVC.initEntry(component.entry))) {
      return true;
    }
    return component.dialogSVC.confirm('Discard changes?');
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

  constructor() { }

}
