import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerComponent } from './spinner.component';
import { SpinnerRoutingModule } from './spinner-routing.module';
import { MaterialModule } from '../../modules/material.module';

@NgModule({
  declarations: [SpinnerComponent],
  imports: [
    CommonModule,
    SpinnerRoutingModule,
    MaterialModule
  ],
  exports: [SpinnerComponent],
})
export class SpinnerModule { }
