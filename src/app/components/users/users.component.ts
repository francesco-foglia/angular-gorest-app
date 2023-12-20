import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
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

  total: number = 0;
  pages: number = 0;
  page: number = 0;
  limit: number = 0;

  searchName: string = '';
  searchEmail: string = '';
  disabled: boolean = false;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getUsers();

    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  getUsers() {
    this.spinner = true;
    this.apiService.get(`users?name=${this.searchName}&email=${this.searchEmail}&page=${this.currentPage}&per_page=${this.resultsPerPage}`).subscribe({
      next: (response: HttpResponse<any>) => {

        const headers = response.headers;

        this.total = +headers.get('X-Pagination-Total')!;
        this.pages = +headers.get('X-Pagination-Pages')!;
        this.page = +headers.get('X-Pagination-Page')!;
        this.limit = +headers.get('X-Pagination-Limit')!;

        this.pages = Math.ceil(this.total / this.resultsPerPage);

        this.users = response.body;
        this.spinner = false;
      },
      error: (error) => {
        this.setMessage('Error getting users', 3000, 'error');
        this.spinner = false;
      }
    });
  }

  clearName() {
    if (this.searchName !== '') {
      this.searchName = '';
      this.getUsers();
    }
  }

  clearEmail() {
    if (this.searchEmail !== '') {
      this.searchEmail = '';
      this.getUsers();
    }
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.disabled = true;
      this.apiService.delete(`users/${userId}`).subscribe({
        next: (data: any) => {
          this.setMessage('User deleted successfully', 3000, 'confirm');
          this.getUsers();
          this.disabled = false;
        },
        error: (error) => {
          this.setMessage('Error deleting user', 3000, 'error');
          this.disabled = false;
        }
      });
    }
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

  addUser(formDirective: any) {
    this.apiService.post('users', this.userForm.value).subscribe({
      next: (data: any) => {
        this.setMessage('User created successfully', 3000, 'confirm');
        this.clearName();
        this.clearEmail();
        formDirective.resetForm();
        this.userForm.reset();
        this.currentPage = 1;
        this.getUsers();
      },
      error: (error) => {
        if (error.error[0].message === "has already been taken") {
          this.setMessage(`User Email ${error.error[0].message}`, 3000, 'error');
          this.clearName();
          this.clearEmail();
        } else {
          this.setMessage('Error adding user', 3000, 'error');
          this.clearName();
          this.clearEmail();
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
