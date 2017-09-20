import { WorkflowEntry } from './../view-models/workflowEntry';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class WorkflowEntryService {

  dataChange: BehaviorSubject<WorkflowEntry[]> = new BehaviorSubject<WorkflowEntry[]>([]);
  entries: FirebaseListObservable<WorkflowEntry[]>;

  get data(): WorkflowEntry[] { return this.dataChange.value; }

  constructor(private db: AngularFireDatabase) {
    this.entries = this.db.list('entries');
    this.entries.subscribe(workflowEntries => {
      this.dataChange.next(workflowEntries);
    });
  }

  deleteEntry(key: string) {
    this.entries.remove(key);
  }

  saveEntry(entry: WorkflowEntry) {
    this.entries.push(entry);
  }

  initEntry(): WorkflowEntry {
    return { name: '', description: '', descriptor: '', graph: '' };
  }

  getEntry(id: string) {

    return this.entries;

    // this.dataChange.value.forEach(entry => {
    //   console.log(entry.$key);
    //   if (entry.$key === id) {
    //     newEntry = entry;
    //   }
    // });
    // console.log(newEntry);
    // return newEntry;
  }

  updateEntry(entry: WorkflowEntry) {
    this.entries.update(entry.$key, entry);
  }
}
