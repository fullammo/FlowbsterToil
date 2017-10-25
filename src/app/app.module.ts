import { AppRoutingModule } from './app-routing.module';
import { DialogService } from './services/dialog.service';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { FwModule } from '../fw/fw.module';
import { AuthenticatedUserComponent } from './authenticated-user/authenticated-user.component';
import { environment } from 'environments/environment';
import { ConnectionComponent } from './connection/connection.component';
import { CoreModule } from 'app/core/core.module';
import { WorkflowModule } from 'app/workflow/shared/workflow.module';

@NgModule({
  declarations: [AppComponent, AuthenticatedUserComponent, ConnectionComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FwModule,
    AppRoutingModule,
    CoreModule,
    WorkflowModule
  ],
  providers: [ DialogService],
  bootstrap: [AppComponent]
})
export class AppModule {}
