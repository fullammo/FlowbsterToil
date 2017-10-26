import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'app/material/material.module';
import { PrimeModule } from 'app/prime/prime.module';
import { KeysPipe } from 'app/shared/keys.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PrimeModule,
    BrowserAnimationsModule
  ],
  declarations: [KeysPipe],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PrimeModule,
    KeysPipe,
    BrowserAnimationsModule
  ]
})
export class SharedModule {}
