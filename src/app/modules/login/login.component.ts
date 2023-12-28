import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});
  value: string = '';
  hide: boolean = true;
  spinner: boolean = false;
  errorMessage: string = '';

  constructor(public authService: AuthService, private router: Router, private formBuilder: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
    } else if (this.authService.isLoggedIn) {
      this.router.navigate(['/users']);
    }

    this.loginForm = this.formBuilder.group({
      token: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.spinner = true;
      sessionStorage.setItem('token', this.loginForm.value.token.trim());
      this.login();
    } else {
      this.errorMessage = 'Fill in the Token field';
    }
  }

  login() {
    const token = sessionStorage.getItem('token');

    this.apiService.get(`users?access-token=${token}`).subscribe({
      next: (data: any) => {
        sessionStorage.setItem('isLoggedIn', 'true');
        this.authService.isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        this.router.navigate(['/users']);
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Invalid token. Log in again';
        } else {
          this.errorMessage = 'An error occurred while logging in';
        }
        sessionStorage.removeItem('token');
        this.spinner = false;
      }
    });
  }

  onInput() {
    this.errorMessage = '';
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }

}
