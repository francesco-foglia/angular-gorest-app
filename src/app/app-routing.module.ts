import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./components/users/users.module').then(m => m.UsersModule), canActivate: [AuthGuard]
  },
  {
    path: 'users/:id',
    loadChildren: () => import('./components/user/user.module').then(m => m.UserModule), canActivate: [AuthGuard]
  },
  {
    path: 'posts',
    loadChildren: () => import('./components/posts/posts.module').then(m => m.PostsModule), canActivate: [AuthGuard]
  },
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: '**', redirectTo: 'users' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
