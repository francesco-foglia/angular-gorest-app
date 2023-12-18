import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  confirmMessage: string = '';
  errorMessage: string = '';
  spinner: boolean = false;
  body: any = document.getElementsByTagName('body')[0];
  users: any[] = [];
  currentPage: number = 1;
  resultsPerPage: number = 100;

  userForm: FormGroup = new FormGroup({});
  newUser: any = {
    name: '',
    email: '',
    gender: '',
    status: '',
  };

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getUsers();

    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      gender: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
    });
  }

  getUsers() {
    this.toggleSpinner();

    this.apiService.get(`users?page=${this.currentPage}&per_page=${this.resultsPerPage}`).subscribe({
      next: (data: any) => {
        this.users = data;
        this.toggleSpinner();
      },
      error: (error) => {
        this.setMessage('Error retrieving users', 3000, 'error');
        this.toggleSpinner();
      }
    });
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {

      this.apiService.delete(`users/${userId}`).subscribe({
        next: (data: any) => {
          this.getUsers();
          this.setMessage('User deleted successfully', 3000, 'confirm');
        },
        error: (error) => {
          this.toggleSpinner();
          this.setMessage('Error deleting user', 3000, 'error');
          this.toggleSpinner();
        }
      });
    }
  }

  toggleSpinner() {
    this.spinner = !this.spinner;
    this.body.classList.toggle('overflow-html');
  }

  setMessage(message: string, duration: number, messageType: 'confirm' | 'error') {
    if (messageType === 'confirm') {
      this.confirmMessage = message;
      setTimeout(() => {
        this.confirmMessage = '';
      }, duration);
    } else if (messageType === 'error') {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = '';
      }, duration);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getUsers();
    }
  }

  nextPage() {
    if (this.users.length === this.resultsPerPage) {
      this.currentPage++;
      this.getUsers();
    }
  }

  addUser() {
    this.apiService.post('users', this.userForm.value).subscribe({
      next: (data: any) => {
        this.getUsers();
        this.setMessage('User created successfully', 3000, 'confirm');
      },
      error: (error) => {
        if (error.error[0].message === "has already been taken") {
          this.toggleSpinner();
          this.setMessage(`User Email ${error.error[0].message}`, 3000, 'error');
          this.toggleSpinner();
        } else {
          this.toggleSpinner();
          this.setMessage('Error creating user', 3000, 'error');
          this.toggleSpinner();
        }
      }
    });
  }

}
