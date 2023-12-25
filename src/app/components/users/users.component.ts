import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

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

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private _snackBar: MatSnackBar) { }

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
      },
      error: (error) => {
        this._snackBar.open('Error getting users', '❌');
      },
      complete: () => {
        this.spinner = false;
      }
    });
  }

  addUser(formDirective: any) {
    this.apiService.post('users', this.userForm.value).subscribe({
      next: (data: any) => {
        this._snackBar.open('User added successfully', '❌');
        this.searchName = '';
        this.searchEmail = '';
        formDirective.resetForm();
        this.userForm.reset();
        this.currentPage = 1;
        this.getUsers();
      },
      error: (error) => {
        if (error.error[0].message === "has already been taken") {
          this._snackBar.open(`User Email ${error.error[0].message}`, '❌');
        } else {
          this._snackBar.open('Error adding user', '❌');
        }
      }
    });
  }

  searchUserName(search: string) {
    this.searchName = search;
    this.currentPage = 1;
    this.getUsers();
  }

  searchUserEmail(search: string) {
    this.searchEmail = search;
    this.currentPage = 1;
    this.getUsers();
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.disabled = true;
      this.apiService.delete(`users/${userId}`).subscribe({
        next: (data: any) => {
          this._snackBar.open('User deleted successfully', '❌');
          this.getUsers();
          this.disabled = false;
        },
        error: (error) => {
          this._snackBar.open('Error deleting user', '❌');
          this.disabled = false;
        }
      });
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

  paginationResults() {
    const results = `
      ${this.currentPage === 1 ? 1 : (this.currentPage - 1) * this.resultsPerPage + 1} -
      ${this.currentPage !== this.pages ? this.currentPage * this.resultsPerPage : this.total} of ${this.total}
    `;
    return results;
  }

}
