import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { DataAccessService } from 'app/workflow/shared/data-access.service';
import { WorkflowEntry } from 'app/workflow/shared/workflowEntry';
import { AuthService } from 'app/core/auth.service';

@Injectable()
export class TemplateService extends DataAccessService<WorkflowEntry> {
  constructor(protected afs: AngularFirestore, protected authSVC: AuthService) {
    super(afs, authSVC, '');
  }
}
