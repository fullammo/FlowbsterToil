import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { FwModule } from '../fw/fw.module';
import { environment } from 'environments/environment';
import { CoreModule } from 'app/core/core.module';
import { WorkflowModule } from 'app/workflow/shared/workflow.module';
import { AppRoutingModule } from 'app/app-routing/app-routing.module';
import { OccopusConfigModule } from 'app/occopus-config/occopus-config.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FwModule,
    AppRoutingModule,
    CoreModule,
    WorkflowModule,
    OccopusConfigModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
