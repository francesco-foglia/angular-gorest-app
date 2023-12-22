import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from './navbar.component';
import { NavbarRoutingModule } from './navbar-routing.module';
import { MaterialModule } from '../../modules/material/material.module';

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    NavbarRoutingModule,
    MaterialModule
  ],
  exports: [NavbarComponent],
})
export class NavbarModule { }
