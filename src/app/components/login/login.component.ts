import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  value: string = '';
  hide: boolean = true;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
    } else if (this.authService.isLoggedIn) {
      this.router.navigate(['/users']);
    }

    this.loginForm = new FormGroup({
      token: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    console.log(this.loginForm.value);
  }

}
