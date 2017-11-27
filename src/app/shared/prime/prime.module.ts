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
  SharedModule,
  ContextMenuModule,
  ConfirmDialogModule
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
    SharedModule,
    ContextMenuModule,
    ConfirmDialogModule
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
    SharedModule,
    ContextMenuModule,
    ConfirmDialogModule
  ]
})
export class PrimeModule {}
