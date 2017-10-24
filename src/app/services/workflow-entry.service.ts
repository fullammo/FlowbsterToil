import { Workflow } from './../editor/models/workflow';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { WorkflowEntry } from 'app/core/models/workflowEntry';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { AuthService } from 'app/core/auth.service';

@Injectable()
export class WorkflowEntryService {
  dataChange: BehaviorSubject<WorkflowEntry[]> = new BehaviorSubject<
    WorkflowEntry[]
  >([]);
  entries: AngularFireList<any>;

  graphsStore: AngularFirestoreDocument<WorkflowEntry>;
  graphs: Observable<WorkflowEntry[]>;

  get data(): WorkflowEntry[] {
    return this.dataChange.value;
  }

  constructor(
    private afs: AngularFirestore,
    private db: AngularFireDatabase,
    private authSVC: AuthService
  ) {
    this.subscribeToUserChanges();
    this.entries = this.db.list<WorkflowEntry[]>('entries');

    this.entries.snapshotChanges().subscribe(actions => {
      const workflowEntries: WorkflowEntry[] = [];
      actions.forEach(action => {
        workflowEntries.push(this.createInitialEntry(action));
      });
      this.dataChange.next(workflowEntries);
    });
  }

  private subscribeToUserChanges() {
    this.authSVC.user.subscribe(user => {
      if (user) {
        this.graphs = this.afs
          .collection<WorkflowEntry>(`users/${user.uid}/entries`)
          .valueChanges();

        console.log(this.graphs);
      }
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
    return this.db
      .object(`/entries/${id}`)
      .snapshotChanges()
      .map(action => {
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
