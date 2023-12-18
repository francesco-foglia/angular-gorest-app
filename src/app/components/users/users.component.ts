import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { HttpResponse } from '@angular/common/http';

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
  resultsPerPage: number = 20;

  userForm: FormGroup = new FormGroup({});
  newUser: any = {
    name: '',
    email: '',
    gender: '',
    status: '',
  };

  // Pagination
  total: number = 0;
  pages: number = 0;
  page: number = 0;
  limit: number = 0;

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
      next: (response: HttpResponse<any>) => {

        console.log('Response:', response);

        const headers = response.headers;
        console.log('Headers:', headers);

        this.total = +headers.get('X-Pagination-Total')!;
        console.log('Total:', this.total);
        this.pages = +headers.get('X-Pagination-Pages')!;
        console.log('Pages:', this.pages);
        this.page = +headers.get('X-Pagination-Page')!;
        console.log('Page:', this.page);
        this.limit = +headers.get('X-Pagination-Limit')!;
        console.log('Limit:', this.limit);

        this.pages = Math.ceil(this.total / this.resultsPerPage);

        this.users = response.body;
        this.toggleSpinner();
      },
      error: (error) => {
        this.setMessage('Error getting users', 3000, 'error');
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
        this.userForm.reset();
      },
      error: (error) => {
        this.toggleSpinner();
        if (error.error[0].message === "has already been taken") {
          this.setMessage(`User Email ${error.error[0].message}`, 3000, 'error');
          this.userForm.reset();
          this.toggleSpinner();
        } else {
          this.setMessage('Error creating user', 3000, 'error');
          this.userForm.reset();
          this.toggleSpinner();
        }
      }
    });
  }

  paginationResults() {
    const results = `
      ${this.currentPage === 1 ? 1 : (this.currentPage - 1) * this.resultsPerPage + 1} -
      ${this.currentPage !== this.pages ? this.currentPage * this.resultsPerPage : this.total} of ${this.total}
    `;
    return results;
  }

}
