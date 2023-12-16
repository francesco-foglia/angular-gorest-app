import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';

import { NavbarRoutingModule } from './navbar-routing.module';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    NavbarRoutingModule,
    MatListModule
  ],
  exports: [NavbarComponent],
})
export class NavbarModule { }
