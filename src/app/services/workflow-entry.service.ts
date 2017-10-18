import { WorkflowEntry } from 'app/view-models/workflowEntry';
import { Workflow } from './../editor/models/workflow';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class WorkflowEntryService {

  dataChange: BehaviorSubject<WorkflowEntry[]> = new BehaviorSubject<WorkflowEntry[]>([]);
  entries: AngularFireList<any>;


  get data(): WorkflowEntry[] { return this.dataChange.value; }

  constructor(private db: AngularFireDatabase) {
    this.entries = this.db.list<WorkflowEntry[]>('entries');
    // this.entries.valueChanges().subscribe((workflowEntries: WorkflowEntry[]) => {
    //   console.log(workflowEntries);
    //   this.dataChange.next(workflowEntries);
    // });

    this.entries.snapshotChanges().subscribe(actions => {
      const workflowEntries: WorkflowEntry[] = [];
      actions.forEach(action => {
        workflowEntries.push(this.createInitialEntry(action));
      });
      this.dataChange.next(workflowEntries);
    });
  }

  deleteEntry(key: string) {
    this.entries.remove(key);
  }

  saveEntry(entry: WorkflowEntry) {
    this.entries.push(entry);
  }

  cloneEntry(entry: WorkflowEntry): WorkflowEntry {
    return {
      name: entry.name + ' clone',
      description: entry.description,
      descriptor: entry.descriptor,
      graph: entry.graph
    };
  }

  initEntry(entry?: WorkflowEntry) {
    if (entry) {
      return {
        name: entry.name,
        description: entry.description,
        descriptor: entry.descriptor,
        graph: entry.graph
      };
    }
    return { name: '', description: '', descriptor: '', graph: '' };
  }

  getEntry(id: string) {
    return this.db.object(`/entries/${id}`).snapshotChanges().map(action => {
      return this.createInitialEntry(action);
    });
  }

  private createInitialEntry(action): WorkflowEntry {
    const entry: WorkflowEntry = action.payload.val();
    entry.$key = action.key;
    return entry;
  }

  updateEntry(entry: WorkflowEntry) {
    const key = entry.$key;
    delete entry.$key;
    this.entries.update(key, entry);
  }
}
