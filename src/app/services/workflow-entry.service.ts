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

  // BONUS: Descriptor could be a little preview window when you hover over and it shows the yaml formatted string.only inspection
  // BONUS: GraphPreview and EditGraph feature.

  // The master checkbox behaves funny.
  // BEHAVIOUR: When entering words from another page the mastercheckbox is going to be indetermined.

  // BEHAVIOR: The Length is bound to something thats changing only when the database changes.
}
