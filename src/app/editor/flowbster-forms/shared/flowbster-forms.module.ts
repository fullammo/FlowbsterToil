import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'app/shared/shared.module';
import { WorkflowPropertiesComponent } from 'app/editor/flowbster-forms/workflow-properties/workflow-properties.component';
import { InputPropertiesComponent } from 'app/editor/flowbster-forms/input-properties/input-properties.component';
import { OutputPropertiesComponent } from 'app/editor/flowbster-forms/output-properties/output-properties.component';
import { NodePropertiesComponent } from 'app/editor/flowbster-forms/node-properties/node-properties.component';
import { JointService } from 'app/editor/flowbster-forms/shared/joint.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [
    WorkflowPropertiesComponent,
    InputPropertiesComponent,
    OutputPropertiesComponent,
    NodePropertiesComponent
  ],
  exports: [
    WorkflowPropertiesComponent,
    InputPropertiesComponent,
    OutputPropertiesComponent,
    NodePropertiesComponent
  ],
  providers: [JointService]
})
export class FlowbsterFormsModule {}
