import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';

const navbarRoutes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('../users/users.module').then(m => m.UsersModule), canActivate: [AuthGuard]
  },
  {
    path: 'posts',
    loadChildren: () => import('../posts/posts.module').then(m => m.PostsModule), canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(navbarRoutes)],
  exports: [RouterModule],
})
export class NavbarRoutingModule { }
