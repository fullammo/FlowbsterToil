import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowbsterFormsModule } from 'app/editor/flowbster-forms/shared/flowbster-forms.module';
import { SharedModule } from 'app/shared/shared.module';
import { ToolbarComponent } from 'app/editor/graph-interaction/toolbar/toolbar.component';
import { PaperComponent } from 'app/editor/graph-interaction/paper/paper.component';
import { DescriptorService } from 'app/editor/graph-interaction/shared/descriptor.service';

@NgModule({
  imports: [CommonModule, SharedModule, FlowbsterFormsModule],
  declarations: [PaperComponent, ToolbarComponent],
  exports: [PaperComponent, ToolbarComponent],
  providers: [DescriptorService]
})
export class GraphInteractionModule {}
