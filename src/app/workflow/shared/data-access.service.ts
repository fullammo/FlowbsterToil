import { AuthService } from 'app/core/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';

/**
 * Defines a simple Data entry that can be saved to the database.
 * (For typechecking purposes)
 */
export interface DataEntry {

  /**
   * The name how the entry is located.
   */
  name?: string;

  /**
   * The unique identifier in the FireStore database.
   */
  $key?: string;
}

/** Holds the parent logic for the FireStore database communication for generic data entries */
export abstract class DataAccessService<T extends DataEntry> {

  /**
   * A subscribable data stream, that informs us about any data changes in the database.
   */
  dataChange: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  /**
   * Holds every subscription made in the service class.
   */
  subscription: Subscription;

  /**
   * A FireStore database reference for a generic collection.
   */
  collection: AngularFirestoreCollection<T>;

  /**
   * Initializes the needed services and instantiates a subscription.
   */
  constructor(protected afs: AngularFirestore, protected authSVC: AuthService) {
    this.subscription = new Subscription();
  }

  /**
   * Subscribes to the logged in users workspace and its collections.
   */
  subscribeToDataChanges(additionalPath: string = '') {
    const subscription: Subscription = this.authSVC.user.subscribe(user => {
      if (user) {
        console.log(additionalPath);
        this.collection = this.afs.collection<T>(
          `users/${user.uid}/entries${additionalPath}`
        );
        console.log(this.collection);
        this.subscribeToSnapShotChanges(this.collection);
      }
    });
    this.subscription.add(subscription);
  }

  /**
   * Subscribes to whenever the snapshot changes, the data stream is fed with clean entity data.
   * @param collection The reference to the given FireStore documents.
   */
  private subscribeToSnapShotChanges(collection) {
    const subscription: Subscription = collection
      .snapshotChanges()
      .subscribe(actions => {
        const entries: T[] = [];
        actions.forEach(action => {
          entries.push(this.createInitialEntry(action));
        });
        this.dataChange.next(entries);
        console.log(entries);
      });
    this.subscription.add(subscription);
  }

  /**
   * Deletes an entry from the document reference of the database.
   * @param key The need to be deleted entity's key.
   */
  deleteEntry(key: string) {
    return this.collection.doc(key).delete();
  }

  /**
   * Saves the actual entry to the reference collection.
   * @param entry Entry to be saved.
   */
  saveEntry(entry: T) {
    return this.collection.add(entry);
  }

  /**
   * Get the specific entry from the database.
   * @param key Needed Entry's database identifier.
   */
  getEntry(key: string) {
    return this.collection
      .doc(key)
      .snapshotChanges()
      .map(action => {
        return this.createInitialEntry(action);
      });
  }

   /**
   * Creates an initial generic entry based on the action, that happened to the snapshot.
   * It matters if the entry is newly created.
   * @param action The event that happened to the snapshot
   */
  private createInitialEntry(action): T {
    let entry: T;

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
   * Updates the generic entry in the database reference collection.
   * @param entry The Updated generic values.
   */
  updateEntry(entry: T) {
    const key = entry.$key;
    delete entry.$key;

    this.collection.doc(key).update(entry);
  }
}
