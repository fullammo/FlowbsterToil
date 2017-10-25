import { NgModule } from '@angular/core';

import {
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatInputModule,
  MatCheckboxModule,
  MatButtonModule,
  MatTooltipModule
} from '@angular/material';

@NgModule({
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule
  ],
  exports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class MaterialModule {}
