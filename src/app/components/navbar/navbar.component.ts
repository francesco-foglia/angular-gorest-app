import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn: boolean = this.authService.isLoggedIn;

  routes = [
    { path: '/users', title: 'Users' },
    { path: '/posts', title: 'Posts' }
  ];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.isLoggedIn = false;
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
