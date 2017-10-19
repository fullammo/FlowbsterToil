import { Routes } from '@angular/router';

import { AuthenticatedUserComponent } from './authenticated-user/authenticated-user.component';
import { SignInComponent } from '../fw/users/sign-in/sign-in.component';
import { RegisterUserComponent } from '../fw/users/register-user/register-user.component';
import { EditorComponent } from './editor/editor/editor.component';
import { WorkflowMaintComponent } from 'app/workflow-maint/workflow-maint.component';
import { WorkflowDetailComponent } from 'app/workflow-detail/workflow-detail.component';
import { ConnectionComponent } from 'app/connection/connection.component';

import { WorkflowDetailDeactivateGuard } from './services/workflow-detail-deactivate-guard.service';
import { WorkflowDetailResolver } from './services/workflow-detail-resolver.service';
import { AuthGuard } from 'app/core/auth.guard';

export const appRoutes: Routes = [
  { path: 'signin', component: SignInComponent },
  { path: 'register', component: RegisterUserComponent },
  {
    path: 'authenticated',
    component: AuthenticatedUserComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: '', redirectTo: 'workflow-maint', pathMatch: 'full' },
          {
            path: 'workflow-detail/:id/:operation',
            component: WorkflowDetailComponent,
            resolve: { detail: WorkflowDetailResolver },
            canDeactivate: [WorkflowDetailDeactivateGuard]
          },
          { path: 'workflow-maint', component: WorkflowMaintComponent },
          { path: 'editor', component: EditorComponent },
          { path: 'connection', component: ConnectionComponent }
        ]
      }
    ]
  },
  { path: '', component: SignInComponent },
  { path: '**', component: SignInComponent }
];
