import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'app/shared/shared.module';
import { JointService } from 'app/editor/flowbster-forms/shared/joint.service';
import { EditorComponent } from 'app/editor/editor.component';
import { GraphInteractionModule } from 'app/editor/graph-interaction/shared/graph-interaction.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    GraphInteractionModule
  ],
  declarations: [EditorComponent],
  exports: [EditorComponent]
})
export class EditorModule {}
