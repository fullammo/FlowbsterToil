import { Injectable } from '@angular/core';
import { DataAccessService } from 'app/workflow/shared/data-access.service';
import { Experiment } from 'app/workflow/shared/experiment';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from 'app/core/auth.service';
import { Deployment } from 'app/workflow/shared/deployment';

@Injectable()
export class ExperimentService extends DataAccessService<Experiment> {
  constructor(protected afs: AngularFirestore, protected authSVC: AuthService) {
    super(afs, authSVC);
  }

  subscribeToDeploymentChanges(deployment: Deployment) {
    const additionPath = `/${deployment.templateKey}/deployments/${
      deployment.$key}/experiments`;
    super.subscribeToDataChanges(additionPath);
  }
}
