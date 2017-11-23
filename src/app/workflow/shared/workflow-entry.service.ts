import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { WorkflowEntry } from 'app/workflow/shared/workflowEntry';
import { AngularFireAuth } from 'angularfire2/auth';
// ***AngularFireStore features ***
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import { AuthService } from 'app/core/auth.service';

// AngularFireStore function are not good enough at the moment.
// The json parsing doesnt work very well. also the pushing has some limitations.

@Injectable()
export class WorkflowEntryService {
  dataChange: BehaviorSubject<WorkflowEntry[]> = new BehaviorSubject<
    WorkflowEntry[]
  >([]);
  entries: AngularFireList<any>;

  // ***AngularFireStore features ***
  graphCollection: AngularFirestoreCollection<WorkflowEntry>;
  graphs: Observable<WorkflowEntry[]>;

  get data(): WorkflowEntry[] {
    return this.dataChange.value;
  }

  constructor(
    // ***AngularFireStore features ***
    private afs: AngularFirestore,
    // private db: AngularFireDatabase,
    private authSVC: AuthService
  ) {
    // ***AngularFireStore features ***
    this.subscribeToUserChanges();

    // this.entries = this.db.list<WorkflowEntry[]>('entries');
    // this.entries.snapshotChanges().subscribe(actions => {
    //   const workflowEntries: WorkflowEntry[] = [];
    //   actions.forEach(action => {
    //     workflowEntries.push(this.createInitialEntry(action));
    //   });
    //   this.dataChange.next(workflowEntries);
    // });
  }

  // ***AngularFireStore features ***
  private subscribeToSnapShotChanges(collection) {
    collection.snapshotChanges().subscribe(actions => {
      const workflowEntries: WorkflowEntry[] = [];
      actions.forEach(action => {
        workflowEntries.push(this.createInitialEntry(action));
      });
      this.dataChange.next(workflowEntries);
    });
  }

  // ***AngularFireStore features ***
  private subscribeToUserChanges() {
    this.authSVC.user.subscribe(user => {
      if (user) {
        this.graphCollection = this.afs.collection<WorkflowEntry>(
          `users/${user.uid}/entries`
        );

        this.subscribeToSnapShotChanges(this.graphCollection);

        this.graphs = this.graphCollection.valueChanges();
        this.graphs.subscribe(graphs => {
          console.log(graphs);
        });
      }
    });
  }

  deleteEntry(key: string) {
    // this.entries.remove(key);

    // ***AngularFireStore features ***
    this.graphCollection.doc(key).delete();
  }

  saveEntry(entry: WorkflowEntry) {
    // return this.entries.push(entry).key;

    // ***AngularFireStore features ***
    return this.graphCollection.add(entry);
  }

  /**
   * Creates and returns a new object without the key attribute of the Entry.
   * @param entry
   */
  peelEntry(entry: WorkflowEntry): WorkflowEntry {
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
    // return this.db
    //   .object(`/entries/${id}`)
    //   .snapshotChanges()
    //   .map(action => {
    //     return this.createInitialEntry(action);
    //   });

    // ***AngularFireStore features ***
    return this.graphCollection
      .doc(id)
      .snapshotChanges()
      .map(action => {
        console.log(action);
        return this.createInitialEntry(action);
      });
  }

  private createInitialEntry(action): WorkflowEntry {
    console.log(action);
    // const entry: WorkflowEntry = action.payload.val();
    // entry.$key = action.key;

    // ***AngularFireStore features ***
    let entry: WorkflowEntry;
    if (action.payload.doc) {
      entry = action.payload.doc._document.value();
      entry.$key = action.payload.doc.id;
    } else {
      entry = action.payload._document.value();
      entry.$key = action.payload.id;
    }

    return entry;
  }

  updateEntry(entry: WorkflowEntry) {
    const key = entry.$key;
    delete entry.$key;
    // this.entries.update(key, entry);

    // ***AngularFireStore features ***
    this.graphCollection.doc(key).update(entry);
  }
}
