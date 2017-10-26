import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JointService } from 'app/editor/shared/joint.service';
import { DescriptorService } from 'app/editor/shared/descriptor.service';
import { SharedModule } from 'app/shared/shared.module';
import { EditorComponent } from 'app/editor/editor/editor.component';
import { ToolbarComponent } from 'app/editor/toolbar/toolbar.component';
import { WorkflowPropertiesComponent } from 'app/editor/workflow-properties/workflow-properties.component';
import { PaperComponent } from 'app/editor/paper/paper.component';
import { InputPropertiesComponent } from 'app/editor/input-properties/input-properties.component';
import { OutputPropertiesComponent } from 'app/editor/output-properties/output-properties.component';
import { NodePropertiesComponent } from 'app/editor/node-properties/node-properties.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    WorkflowPropertiesComponent,
    PaperComponent,
    EditorComponent,
    ToolbarComponent,
    WorkflowPropertiesComponent,
    InputPropertiesComponent,
    OutputPropertiesComponent,
    NodePropertiesComponent
  ],
  providers: [JointService, DescriptorService],
  exports: [EditorComponent]
})
export class EditorModule {}
