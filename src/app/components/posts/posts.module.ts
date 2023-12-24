import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsComponent } from './posts.component';
import { PostsRoutingModule } from './posts-routing.module';
import { MaterialModule } from '../../modules/material.module';
import { NavbarModule } from '../navbar/navbar.module';
import { MessageModule } from '../message/message.module';
import { SearchModule } from '../search/search.module';
import { SpinnerModule } from '../spinner/spinner.module';


@NgModule({
  declarations: [PostsComponent],
  imports: [
    CommonModule,
    PostsRoutingModule,
    MaterialModule,
    NavbarModule,
    MessageModule,
    SearchModule,
    SpinnerModule
  ]
})
export class PostsModule { }
