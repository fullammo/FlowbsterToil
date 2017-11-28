import { AngularFirestore } from 'angularfire2/firestore';
import { Deployment } from './deployment';
import { DataAccessService } from 'app/workflow/shared/data-access.service';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth.service';

@Injectable()
export class DeploymentService extends DataAccessService<Deployment> {
  constructor(protected afs: AngularFirestore, protected authSVC: AuthService) {
    super(afs, authSVC);
  }

  subscribeToDataChanges(entryKey: string) {
    const additionPath = `/${entryKey}/deployments`;
    super.subscribeToDataChanges(additionPath);
  }

  resetSubscriptions(entryKey: string) {
    this.subscription.unsubscribe();
    this.subscribeToDataChanges(entryKey);
  }
}
