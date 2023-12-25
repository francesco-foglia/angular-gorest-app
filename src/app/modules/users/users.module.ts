import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';
import { MaterialModule } from '../../modules/material.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { PaginationModule } from '../../components/pagination/pagination.module';
import { SearchModule } from '../../components/search/search.module';
import { SpinnerModule } from '../../components/spinner/spinner.module';


@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule,
    NavbarModule,
    PaginationModule,
    SearchModule,
    SpinnerModule
  ]
})
export class UsersModule { }
