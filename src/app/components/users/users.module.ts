import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';
import { MaterialModule } from '../../modules/material/material.module';
import { NavbarModule } from '../navbar/navbar.module';
import { MessageModule } from '../message/message.module';
import { SpinnerModule } from '../spinner/spinner.module';


@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule,
    NavbarModule,
    MessageModule,
    SpinnerModule
  ]
})
export class UsersModule { }
