import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsComponent } from './posts.component';
import { PostsRoutingModule } from './posts-routing.module';

import { NavbarComponent } from '../navbar/navbar.component';

@NgModule({
  declarations: [PostsComponent, NavbarComponent],
  imports: [
    CommonModule,
    PostsRoutingModule
  ]
})
export class PostsModule { }
