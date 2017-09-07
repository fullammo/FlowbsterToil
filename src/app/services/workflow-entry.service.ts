import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { WorkflowEntry } from 'app/view-models/workflowEntry';

@Injectable()
export class WorkflowEntryService {

  constructor(private db: AngularFireDatabase) { }

    getWorkflowEntries(): FirebaseListObservable<WorkflowEntry[]> {
      return this.db.list('entries');
    }

}
