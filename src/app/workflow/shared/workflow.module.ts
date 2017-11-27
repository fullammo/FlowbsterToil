import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkflowMaintComponent } from 'app/workflow/workflow-maint/workflow-maint.component';
import { WorkflowDetailComponent } from 'app/workflow/workflow-detail/workflow-detail.component';
import { WorkflowEntryService } from 'app/workflow/shared/workflow-entry.service';
import { CloudMessagingService } from 'app/workflow/shared/cloud-messaging.service';

import { SharedModule } from 'app/shared/shared.module';
import { OccoService } from 'app/workflow/shared/occo.service';
import { EditorModule } from 'app/editor/editor.module';
import { WorkflowManagerComponent } from 'app/workflow/workflow-manager/workflow-manager.component';
import { BuildContextPropertiesComponent } from 'app/workflow/build-context-properties/build-context-properties.component';

@NgModule({
  imports: [CommonModule, SharedModule, EditorModule],
  declarations: [
    WorkflowMaintComponent,
    WorkflowDetailComponent,
    WorkflowManagerComponent,
    BuildContextPropertiesComponent
  ],
  providers: [WorkflowEntryService, CloudMessagingService, OccoService]
})
export class WorkflowModule {}
