import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkflowDetailComponent } from 'app/workflow/workflow-detail/workflow-detail.component';
import { WorkflowMaintComponent } from 'app/workflow/workflow-maint/workflow-maint.component';
import { EditorComponent } from 'app/editor/editor.component';
import { FrameworkBodyComponent } from 'fw/framework-body/framework-body.component';
import { SignInComponent } from 'fw/users/sign-in/sign-in.component';
import { RegisterUserComponent } from 'fw/users/register-user/register-user.component';
import { AuthGuard } from 'app/core/auth.guard';
import { WorkflowDetailResolver } from 'app/app-routing/workflow-detail-resolver.service';
import { WorkflowDetailDeactivateGuard } from 'app/app-routing/workflow-detail-deactivate-guard.service';
import { ConnectionComponent } from 'app/occopus-config/connection/connection.component';
import { WorkflowManagerComponent } from 'app/workflow/workflow-manager/workflow-manager.component';

export const appRoutes: Routes = [
  { path: 'signin', component: SignInComponent },
  { path: 'register', component: RegisterUserComponent },
  {
    path: 'authenticated',
    component: FrameworkBodyComponent,
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
          { path: 'workflow-man', component: WorkflowManagerComponent },
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
