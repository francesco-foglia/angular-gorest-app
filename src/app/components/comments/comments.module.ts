import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommentsComponent } from './comments.component';
import { CommentsRoutingModule } from './comments-routing.module';
import { MaterialModule } from '../../modules/material.module';

@NgModule({
  declarations: [CommentsComponent],
  imports: [
    CommonModule,
    CommentsRoutingModule,
    MaterialModule
  ],
  exports: [CommentsComponent],
})
export class CommentsModule { }
