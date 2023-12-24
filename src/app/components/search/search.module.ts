import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchComponent } from './search.component';
import { SearchRoutingModule } from './search-routing.module';
import { MaterialModule } from '../../modules/material.module';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    MaterialModule
  ],
  exports: [SearchComponent],
})
export class SearchModule { }
