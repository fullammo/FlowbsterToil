import { NgModule } from '@angular/core';

import {
  MenuModule,
  DialogModule,
  GrowlModule,
  DropdownModule,
  PanelModule,
  InputTextModule,
  ButtonModule,
  FileUploadModule,
  TabViewModule,
  CodeHighlighterModule,
  DataTableModule,
  SharedModule
} from 'primeng/primeng';

@NgModule({
  imports: [
    MenuModule,
    DialogModule,
    GrowlModule,
    DropdownModule,
    PanelModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    TabViewModule,
    CodeHighlighterModule,
    DataTableModule,
    SharedModule
  ],
  exports: [
    MenuModule,
    DialogModule,
    GrowlModule,
    DropdownModule,
    PanelModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    TabViewModule,
    CodeHighlighterModule,
    DataTableModule,
    SharedModule
  ]
})
export class PrimeModule {}
