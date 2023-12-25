import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsComponent } from './posts.component';
import { PostsRoutingModule } from './posts-routing.module';
import { MaterialModule } from '../../modules/material.module';
import { CommentsModule } from '../../components/comments/comments.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { PaginationModule } from '../../components/pagination/pagination.module';
import { SearchModule } from '../../components/search/search.module';
import { SpinnerModule } from '../../components/spinner/spinner.module';


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
