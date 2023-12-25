import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginationComponent } from './pagination.component';
import { PaginationRoutingModule } from './pagination-routing.module';
import { MaterialModule } from '../../modules/material.module';

@NgModule({
  declarations: [PaginationComponent],
  imports: [
    CommonModule,
    PaginationRoutingModule,
    MaterialModule
  ],
  exports: [PaginationComponent],
})
export class PaginationModule { }
