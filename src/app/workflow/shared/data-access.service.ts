import { AuthService } from 'app/core/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';

interface DataEntry {
  $key?: string;
}

export abstract class DataAccessService<T extends DataEntry> {
  dataChange: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  subscription: Subscription;
  collection: AngularFirestoreCollection<T>;

  constructor(protected afs: AngularFirestore, protected authSVC: AuthService) {
    this.subscription = new Subscription();
  }

  protected subscribeToDataChanges(additionalPath: string = '') {
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

  deleteEntry(key: string) {
    return this.collection.doc(key).delete();
  }

  saveEntry(entry: T) {
    return this.collection.add(entry);
  }

  getEntry(key: string) {
    return this.collection
      .doc(key)
      .snapshotChanges()
      .map(action => {
        return this.createInitialEntry(action);
      });
  }

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

  updateEntry(entry: T) {
    const key = entry.$key;
    delete entry.$key;

    this.collection.doc(key).update(entry);
  }
}
