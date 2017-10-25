import { ConnectionComponent } from 'app/connection/connection.component';
import { EditorComponent } from './editor/editor/editor.component';
import { WorkflowDetailDeactivateGuard } from './services/workflow-detail-deactivate-guard.service';
import { WorkflowDetailResolver } from './services/workflow-detail-resolver.service';
import { RegisterUserComponent } from './../fw/users/register-user/register-user.component';
import { SignInComponent } from './../fw/users/sign-in/sign-in.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

import { CoreModule } from './core/core.module';
import { AuthenticatedUserComponent } from 'app/authenticated-user/authenticated-user.component';
import { WorkflowDetailComponent } from 'app/workflow/workflow-detail/workflow-detail.component';
import { WorkflowMaintComponent } from 'app/workflow/workflow-maint/workflow-maint.component';

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

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard, WorkflowDetailResolver, WorkflowDetailDeactivateGuard]
})
export class AppRoutingModule {}
