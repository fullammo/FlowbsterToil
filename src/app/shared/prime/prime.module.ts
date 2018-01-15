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
  DataListModule,
  TooltipModule
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
    DataListModule,
    TooltipModule
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
    DataListModule,
    TooltipModule
  ]
})
export class PrimeModule {}
