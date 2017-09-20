import { WorkflowDetailResolver } from './services/workflow-detail-resolver.service';
import { Routes } from '@angular/router';

import { AuthenticatedUserComponent } from './authenticated-user/authenticated-user.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CountryListComponent } from './country-list/country-list.component';
import { CountryDetailComponent } from './country-detail/country-detail.component';
import { CountryMaintComponent } from './country-maint/country-maint.component';
import { SignInComponent } from '../fw/users/sign-in/sign-in.component';
import { RegisterUserComponent } from '../fw/users/register-user/register-user.component';
import { AuthGuard } from './services/auth-guard.service';
import { NodeDefComponent } from './node-def/node-def.component';
import { AuthFileComponent } from './auth-file/auth-file.component';
import { EditorComponent } from './editor/editor/editor.component';
import { WorkflowMaintComponent } from 'app/workflow-maint/workflow-maint.component';
import { WorkflowDetailComponent } from 'app/workflow-detail/workflow-detail.component';

export const appRoutes: Routes = [
  { path: 'signin', component: SignInComponent },
  { path: 'register', component: RegisterUserComponent },
  {
    path: 'authenticated', component: AuthenticatedUserComponent, canActivate: [AuthGuard],
    children: [
      {
        path: '', canActivateChild: [AuthGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent },
          { path: 'country-list/:count', component: CountryListComponent },
          { path: 'country-detail/:id/:operation', component: CountryDetailComponent },
          { path: 'workflow-detail/:id/:operation', component: WorkflowDetailComponent, resolve: { detail: WorkflowDetailResolver } },
          { path: 'country-maint', component: CountryMaintComponent },
          { path: 'workflow-maint', component: WorkflowMaintComponent },
          { path: 'editor', component: EditorComponent },
          { path: 'authform', component: AuthFileComponent },
          { path: 'nodeform', component: NodeDefComponent }
        ]
      }
    ]
  },
  { path: '', component: SignInComponent },
  { path: '**', component: SignInComponent }
];
