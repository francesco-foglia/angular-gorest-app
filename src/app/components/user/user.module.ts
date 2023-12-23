import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { MaterialModule } from '../../modules/material.module';
import { NavbarModule } from '../navbar/navbar.module';
import { MessageModule } from '../message/message.module';
import { SpinnerModule } from '../spinner/spinner.module';


@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    NavbarModule,
    MessageModule,
    SpinnerModule
  ]
})
export class UserModule { }
