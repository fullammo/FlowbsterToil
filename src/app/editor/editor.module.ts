import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import {
  MenuModule, DialogModule, GrowlModule, DropdownModule, PanelModule, InputTextModule, ButtonModule, FileUploadModule, TabViewModule,
  CodeHighlighterModule
} from 'primeng/primeng';
import { MatInputModule, MatCheckboxModule, MatSelectModule, MatSliderModule } from '@angular/material';

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
import { LowerCaseTextDirective } from './shared/lower-case-text.directive';
import { UpperCaseTextDirective } from './shared/upper-case-text.directive';

import 'hammerjs';


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MenuModule,
    FileUploadModule,
    MatSliderModule,
    DialogModule,
    GrowlModule,
    TabViewModule,
    CodeHighlighterModule,
    ReactiveFormsModule,
    DropdownModule,
    PanelModule,
    InputTextModule,
    ButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule
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
    NodePropertiesComponent,
    LowerCaseTextDirective,
    UpperCaseTextDirective
  ],
  providers: [JointService, DescriptorService],
  exports: [EditorComponent]
})
export class EditorModule { }

