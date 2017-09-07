import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { WorkflowEntry } from 'app/view-models/workflowEntry';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class WorkflowEntryService {

  dataChange: BehaviorSubject<WorkflowEntry[]> = new BehaviorSubject<WorkflowEntry[]>([]);

  get data(): WorkflowEntry[] { return this.dataChange.value; }

  constructor(private db: AngularFireDatabase) {
    this.db.list('entries').subscribe(workflowEntries => {
      this.dataChange.next(workflowEntries);
    });
  }
}
