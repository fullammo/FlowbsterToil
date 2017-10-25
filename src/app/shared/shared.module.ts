import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'app/material/material.module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule]
})
export class SharedModule {}
