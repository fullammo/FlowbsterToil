import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectionComponent } from 'app/occopus-config/connection/connection.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ConnectionComponent]
})
export class OccopusConfigModule {}
