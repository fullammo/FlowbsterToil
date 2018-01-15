import { CloudMessagingService } from './../workflow/shared/cloud-messaging.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { UserApi } from 'fw/users/user-api';
import { User } from 'app/core/models/user';

/**
 * Holds the logic for user authentication via AngularFire.
 */
@Injectable()
export class AuthService implements UserApi {
  /**
   * Holds the User entity as an event stream.
   */
  user: Observable<User>;

  /**
   * Initializes the needed services.
   */
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private cloudMessagingSVC: CloudMessagingService
  ) {
    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.switchMap(user => {
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return Observable.of(null);
      }
    });
  }

  /**
   * Logs the user in using the Google Authentication Provider.
   */
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  /**
   * Signs the user in, asks for push notification permissions and navigates to the guarded routes.
   * @param provider The chosen authentication provider
   */
  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider).then(credential => {
      this.updateUserData(credential.user);
      this.cloudMessagingSVC.getPermission();
      this.navigate();
    });
  }

  navigate(): void {
    this.router.navigate(['/authenticated']);
  }

  /**
   * Updates user data in the FireStore database based on the providers information.
   */
  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    return userRef.set(data);
  }

  /**
   * Sings the user out from the Authentication service and navigates to the index page.
   */
  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }
}
