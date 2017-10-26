import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkflowMaintComponent } from 'app/workflow/workflow-maint/workflow-maint.component';
import { WorkflowDetailComponent } from 'app/workflow/workflow-detail/workflow-detail.component';
import { WorkflowEntryService } from 'app/workflow/shared/workflow-entry.service';
import { CloudMessagingService } from 'app/workflow/shared/cloud-messaging.service';

import { SharedModule } from 'app/shared/shared.module';
import { OccoService } from 'app/workflow/shared/occo.service';
import { EditorModule } from 'app/editor/shared/editor.module';

@NgModule({
  imports: [CommonModule, SharedModule, EditorModule],
  declarations: [WorkflowMaintComponent, WorkflowDetailComponent],
  providers: [WorkflowEntryService, CloudMessagingService, OccoService]
})
export class WorkflowModule {}
