import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { DataAccessService } from 'app/workflow/shared/data-access.service';
import { WorkflowEntry } from 'app/workflow/shared/workflowEntry';
import { AuthService } from 'app/core/auth.service';

/**
 * Holds the logic to serve the communication needs with the WorkflowEntry database records.
 */
@Injectable()
export class TemplateService extends DataAccessService<WorkflowEntry> {

  /**
   * Initializes the need services, calls the parent constructor and listens on data changes.
   */
  constructor(protected afs: AngularFirestore, protected authSVC: AuthService) {
    super(afs, authSVC);
    super.subscribeToDataChanges();
  }
}
