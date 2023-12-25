import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsComponent } from './posts.component';
import { PostsRoutingModule } from './posts-routing.module';
import { MaterialModule } from '../../modules/material.module';
import { CommentsModule } from '../comments/comments.module';
import { NavbarModule } from '../navbar/navbar.module';
import { PaginationModule } from '../pagination/pagination.module';
import { SearchModule } from '../search/search.module';
import { SpinnerModule } from '../spinner/spinner.module';


@NgModule({
  declarations: [PostsComponent],
  imports: [
    CommonModule,
    PostsRoutingModule,
    MaterialModule,
    CommentsModule,
    NavbarModule,
    PaginationModule,
    SearchModule,
    SpinnerModule
  ]
})
export class PostsModule { }
