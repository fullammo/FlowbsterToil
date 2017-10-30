import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { KeysPipe } from 'app/shared/keys.pipe';

import { MaterialModule } from 'app/shared/material/material.module';
import { PrimeModule } from 'app/shared/prime/prime.module';

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
