import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsComponent } from './posts.component';
import { PostsRoutingModule } from './posts-routing.module';
import { MaterialModule } from '../../modules/material/material.module';
import { NavbarModule } from '../navbar/navbar.module';
import { SpinnerModule } from '../spinner/spinner.module';


@NgModule({
  declarations: [PostsComponent],
  imports: [
    CommonModule,
    PostsRoutingModule,
    MaterialModule,
    NavbarModule,
    SpinnerModule
  ]
})
export class PostsModule { }
