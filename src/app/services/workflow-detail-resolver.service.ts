import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { WorkflowEntryService } from 'app/services/workflow-entry.service';
import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { WorkflowEntry } from 'app/core/models/workflowEntry';

@Injectable()
export class WorkflowDetailResolver implements Resolve<WorkflowEntry> {
  constructor(
    private workflowEntrySVC: WorkflowEntryService,
    private router: Router
  ) {}

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
