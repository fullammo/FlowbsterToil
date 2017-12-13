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
  ConfirmDialogModule,
  DataListModule
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
    ConfirmDialogModule,
    DataListModule
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
    ConfirmDialogModule,
    DataListModule
  ]
})
export class PrimeModule {}
