import { NgModule } from '@angular/core';

import { AuthService } from './auth.service';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AuthGuard } from 'app/core/auth.guard';

import { UserApi } from 'fw/users/user-api';

@NgModule({
  imports: [AngularFireAuthModule, AngularFirestoreModule],
  providers: [
    AuthService,
    { provide: UserApi, useExisting: AuthService },
    AuthGuard
  ]
})
export class CoreModule {}
