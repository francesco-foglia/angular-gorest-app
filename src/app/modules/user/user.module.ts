import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { MaterialModule } from '../../modules/material.module';
import { CommentsModule } from '../../components/comments/comments.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { SpinnerModule } from '../../components/spinner/spinner.module';


@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    CommentsModule,
    NavbarModule,
    SpinnerModule
  ]
})
export class UserModule { }
