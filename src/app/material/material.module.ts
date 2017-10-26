import { NgModule } from '@angular/core';

import {
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatInputModule,
  MatCheckboxModule,
  MatButtonModule,
  MatTooltipModule,
  MatSelectModule,
  MatSliderModule
} from '@angular/material';

@NgModule({
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    MatSliderModule
  ],
  exports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    MatSliderModule
  ]
})
export class MaterialModule {}
