import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MdTableModule, MdPaginatorModule } from '@angular/material';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { FwModule } from '../fw/fw.module';
import { EditorModule } from 'app/editor/editor.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { appRoutes } from './app.routing';
import { CountryDetailComponent } from './country-detail/country-detail.component';
import { CountryListComponent } from './country-list/country-list.component';
import { CountryMaintComponent } from './country-maint/country-maint.component';
import { AuthenticatedUserComponent } from './authenticated-user/authenticated-user.component';
import { UserService } from './services/user.service';
import { UserApi } from '../fw/users/user-api';
import { AuthGuard } from './services/auth-guard.service';
import { AppDataService } from './services/app-data.service';
import { CountryPanelComponent } from './panels/country-panel/country-panel.component';
import { ImagePanelComponent } from './panels/image-panel/image-panel.component';
import { NodeDefComponent } from './node-def/node-def.component';
import { AuthFileComponent } from './auth-file/auth-file.component';
import { WorkflowMaintComponent } from './workflow-maint/workflow-maint.component';
import { environment } from 'environments/environment';
import { WorkflowDetailComponent } from './workflow-detail/workflow-detail.component';
import { WorkflowEntryService } from 'app/services/workflow-entry.service';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CountryDetailComponent,
    CountryListComponent,
    CountryMaintComponent,
    AuthenticatedUserComponent,
    CountryPanelComponent,
    ImagePanelComponent,
    NodeDefComponent,
    AuthFileComponent,
    WorkflowMaintComponent,
    WorkflowDetailComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule,
    HttpModule,
    FwModule,
    RouterModule.forRoot(appRoutes),
    FlexLayoutModule,
    EditorModule,
    MdTableModule,
    MdPaginatorModule
  ],
  providers: [
    UserService,
    { provide: UserApi, useExisting: UserService },
    AuthGuard,
    AppDataService,
    WorkflowEntryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
