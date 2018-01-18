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
/**
 * Interacts with the WorkflowEntry database collection.
 */
@Injectable()
export class WorkflowEntryService {
  /**
   * An event stream that informs the subscribers about that the data in the database has been changed.
   */
  dataChange: BehaviorSubject<WorkflowEntry[]> = new BehaviorSubject<
    WorkflowEntry[]
  >([]);

  // ***AngularFireStore features ***
  /**
   * The FireStore Collection reference for the database entries.
   */
  graphCollection: AngularFirestoreCollection<WorkflowEntry>;

  /** needed for workflowmaint still... */
  graphs: Observable<WorkflowEntry[]>;

  /** needed for workflowmaint still... */
  get data(): WorkflowEntry[] {
    return this.dataChange.value;
  }

  /**
   * Initializes the needed services.
   */
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
  /**
   * Parses the snapshot entries into actual WorkflowEntries and feeds a subscribable datastream.
   * @param collection
   */
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
  /**
   * If the user changes we subscribe to its database events.
   */
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

  /**
   * Deletes the actual entry from the Graphs collection.
   * @param key The unique ID of the Entry
   */
  deleteEntry(key: string) {
    // this.entries.remove(key);

    // ***AngularFireStore features ***
    this.graphCollection.doc(key).delete();
  }

  /**
   * Saves the actual workflow entry to the users collection.
   * @param entry The to be saved Workflow Entry
   */
  saveEntry(entry: WorkflowEntry) {
    // return this.entries.push(entry).key;

    // ***AngularFireStore features ***
    return this.graphCollection.add(entry);
  }

  /**
   * Creates and returns a new object without the key attribute of the Entry.
   * (Should be deleted after Workflow maint is deprecated.)
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

  /**
   * Should be deleted after Workflow maint is deprecated.
   */
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

  /**
   * Returns the actual WorkflowEntry entity from a FireStore snapshot
   * @param id Unique ID of the needed Entry.
   */
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

  /**
   * Creates an initial WorkflowEntry based on the action, that happened to the snapshot.
   * It matters if the entry is newly created.
   * @param action The event that happened to the snapshot
   */
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

  /**
   * Updates the actual entry of the database without the database ID.
   * @param entry The actual entry with updated properties.
   */
  updateEntry(entry: WorkflowEntry) {
    const key = entry.$key;
    delete entry.$key;
    // this.entries.update(key, entry);

    // ***AngularFireStore features ***
    this.graphCollection.doc(key).update(entry);
  }
}
