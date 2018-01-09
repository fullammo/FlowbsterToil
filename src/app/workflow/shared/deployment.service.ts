import { AngularFirestore } from 'angularfire2/firestore';
import { Deployment } from './deployment';
import { DataAccessService } from 'app/workflow/shared/data-access.service';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth.service';

/**
 * Holds the logic for the database communication in context of a Templates deployments.
 */
@Injectable()
export class DeploymentService extends DataAccessService<Deployment> {

  /**
   * Initializes the needed services and passes them to the parent constructor.
   */
  constructor(protected afs: AngularFirestore, protected authSVC: AuthService) {
    super(afs, authSVC);
  }

  /**
   * Changes the data path based on the template's key and subscribes to its data changing events.
   * @param entryKey The unique identifier key of the parent Template.
   */
  subscribeToDataChanges(entryKey: string) {
    const additionPath = `/${entryKey}/deployments`;
    super.subscribeToDataChanges(additionPath);
  }
}
