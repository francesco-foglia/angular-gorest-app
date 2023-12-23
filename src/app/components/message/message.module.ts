import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageComponent } from './message.component';
import { MessageRoutingModule } from './message-routing.module';
import { MaterialModule } from '../../modules/material.module';

@NgModule({
  declarations: [MessageComponent],
  imports: [
    CommonModule,
    MessageRoutingModule,
    MaterialModule
  ],
  exports: [MessageComponent],
})
export class MessageModule { }
