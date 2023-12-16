import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsComponent } from './posts.component';
import { PostsRoutingModule } from './posts-routing.module';

import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [PostsComponent],
  imports: [
    CommonModule,
    PostsRoutingModule,
    MatListModule
  ]
})
export class PostsModule { }
