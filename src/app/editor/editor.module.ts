import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import {
  MenuModule, DialogModule, GrowlModule, DropdownModule, PanelModule, InputTextModule, ButtonModule, FileUploadModule, TabViewModule,
  CodeHighlighterModule
} from 'primeng/primeng';
import { MdInputModule, MdErrorDirective, MdCheckboxModule, MdSelectModule, MdSliderModule } from '@angular/material';

import { EditorComponent } from './editor/editor.component';
import { PaperComponent } from './paper/paper.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { WorkflowPropertiesComponent } from './workflow-properties/workflow-properties.component';
import { JointService } from 'app/editor/shared/joint.service';
import { DescriptorService } from 'app/editor/shared/descriptor.service';
import { KeysPipe } from './shared/keys.pipe';
import { InputPropertiesComponent } from './input-properties/input-properties.component';
import { OutputPropertiesComponent } from './output-properties/output-properties.component';
import { NodePropertiesComponent } from './node-properties/node-properties.component';

import 'hammerjs';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MenuModule,
    FileUploadModule,
    MdSliderModule,
    DialogModule,
    GrowlModule,
    TabViewModule,
    CodeHighlighterModule,
    ReactiveFormsModule,
    DropdownModule,
    PanelModule,
    InputTextModule,
    ButtonModule,
    MdInputModule,
    MdCheckboxModule,
    MdSelectModule
  ],
  declarations: [
    EditorComponent,
    ToolbarComponent,
    WorkflowPropertiesComponent,
    PaperComponent,
    EditorComponent,
    PaperComponent,
    ToolbarComponent,
    WorkflowPropertiesComponent,
    KeysPipe,
    InputPropertiesComponent,
    OutputPropertiesComponent,
    NodePropertiesComponent
  ],
  providers: [JointService, DescriptorService],
  exports: [EditorComponent]
})
export class EditorModule { }

