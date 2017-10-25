import { AppRoutingModule } from './app-routing.module';
import { CloudMessagingService } from './services/cloud-messaging.service';
import { DialogService } from './services/dialog.service';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatInputModule,
  MatCheckboxModule,
  MatButtonModule,
  MatTooltipModule
} from '@angular/material';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { FwModule } from '../fw/fw.module';
import { EditorModule } from 'app/editor/editor.module';
import { appRoutes } from './app.routing';
import { AuthenticatedUserComponent } from './authenticated-user/authenticated-user.component';
import { WorkflowMaintComponent } from './workflow-maint/workflow-maint.component';
import { environment } from 'environments/environment';
import { WorkflowDetailComponent } from './workflow-detail/workflow-detail.component';
import { WorkflowEntryService } from 'app/services/workflow-entry.service';
import { OccoService } from 'app/services/occo.service';
import { ConnectionComponent } from './connection/connection.component';
import { CoreModule } from 'app/core/core.module';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticatedUserComponent,
    WorkflowMaintComponent,
    WorkflowDetailComponent,
    ConnectionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule,
    HttpModule,
    FwModule,
    AppRoutingModule,
    FlexLayoutModule,
    EditorModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    CoreModule
  ],
  providers: [
    WorkflowEntryService,
    OccoService,
    DialogService,
    CloudMessagingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
