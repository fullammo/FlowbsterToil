import { Injectable } from '@angular/core';
import { DataAccessService } from 'app/workflow/shared/data-access.service';
import { Experiment } from 'app/workflow/shared/experiment';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from 'app/core/auth.service';
import { Deployment } from 'app/workflow/shared/deployment';

/**
 * Holds the logic to serve the communication needs with an Experiment database record.
 */
@Injectable()
export class ExperimentService extends DataAccessService<Experiment> {

  /**
   * Initialize the needed services and passes them to the parent constructor.
   */
  constructor(protected afs: AngularFirestore, protected authSVC: AuthService) {
    super(afs, authSVC);
  }

  /**
   * Changes the subscriptions and record path based on the parent deployment.
   * @param deployment The parent deployment.
   */
  subscribeToDeploymentChanges(deployment: Deployment) {
    const additionPath = `/${deployment.templateKey}/deployments/${
      deployment.$key}/experiments`;
    super.subscribeToDataChanges(additionPath);
  }
}
