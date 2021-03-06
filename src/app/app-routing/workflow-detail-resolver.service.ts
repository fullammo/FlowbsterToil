import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { WorkflowEntry } from 'app/workflow/shared/workflowEntry';
import { WorkflowEntryService } from 'app/workflow/shared/workflow-entry.service';

/**
 * Helps to resolve individual workflow data on the workflow detail's view before the route view gets rendered.
 */
@Injectable()
export class WorkflowDetailResolver implements Resolve<WorkflowEntry> {

  /**
   * Initializes the needed services.
   */
  constructor(
    private workflowEntrySVC: WorkflowEntryService,
    private router: Router
  ) {}

  /**
   * The database communication service gets the Workflow Entry from the route params nad navigates to the correct view
   * based on the information.
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<WorkflowEntry> {
    const operation = route.paramMap.get('operation');
    const id = route.paramMap.get('id');

    return this.workflowEntrySVC
      .getEntry(id)
      .take(1)
      .map(entry => {
        if (entry) {
          return entry;
        } else {
          if (operation === 'create' && id === '0') {
            return this.workflowEntrySVC.initEntry();
          } else {
            this.router.navigate(['/authenticated/workflow-maint']);
          }
          return null;
        }
      });
  }
}
