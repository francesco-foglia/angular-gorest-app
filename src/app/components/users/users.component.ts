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

  loadingAllUsers: boolean = false;
  allUsersArray: any[] = [];

  searchedUsers: any[] = [];
  searchedUsersLength: number = 0;
  searchTerm: string = '';

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getUsers();
    this.getAllUsers();

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

        const headers = response.headers;

        this.total = +headers.get('X-Pagination-Total')!;
        this.pages = +headers.get('X-Pagination-Pages')!;
        this.page = +headers.get('X-Pagination-Page')!;
        this.limit = +headers.get('X-Pagination-Limit')!;

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

  getAllUsers() {
    this.getAllUsersRecursive(1, []);
  }

  getAllUsersRecursive(page: number, allUsers: any[]) {
    this.loadingAllUsers = true;
    const url = `users?page=${page}&per_page=100`;

    this.apiService.get(url).subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.body.length > 0) {
          allUsers = allUsers.concat(response.body);
          setTimeout(() => {
            this.getAllUsersRecursive(page + 1, allUsers);
          }, 100);
        } else {
          this.allUsersArray = allUsers;
          this.loadingAllUsers = false;
        }
      },
      error: (error) => {
        if (error.status === 429) {
          this.setMessage('Error getting all users. Please log out and try again later', 5000, 'error');
        } else {
          this.setMessage('Error getting all users', 3000, 'error');
        }
      }
    });
  }

  searchUsers() {
    if (this.searchTerm.trim() !== '') {
      this.toggleSpinner();
      this.searchedUsers = this.allUsersArray.filter(user =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.users = this.searchedUsers;
      this.searchedUsersLength = this.searchedUsers.length;
      this.toggleSpinner();
    } else {
      this.getUsers();
    }
  }

  clearInput() {
    if (this.searchTerm !== '') {
      this.searchTerm = '';
      this.searchedUsersLength = 0;
      this.getUsers();
    }
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {

      this.apiService.delete(`users/${userId}`).subscribe({
        next: (data: any) => {
          this.getUsers();
          this.setMessage('User deleted successfully', 3000, 'confirm');
          this.clearInput();
          this.getAllUsers();
        },
        error: (error) => {
          this.toggleSpinner();
          this.setMessage('Error deleting user', 3000, 'error');
          this.clearInput();
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
        this.clearInput();
        this.userForm.reset();
        this.getAllUsers();
      },
      error: (error) => {
        this.toggleSpinner();
        if (error.error[0].message === "has already been taken") {
          this.setMessage(`User Email ${error.error[0].message}`, 3000, 'error');
          this.clearInput();
          this.userForm.reset();
          this.toggleSpinner();
        } else {
          this.setMessage('Error adding user', 3000, 'error');
          this.clearInput();
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
