import { Component, OnInit } from '@angular/core';
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

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.toggleSpinner();

    this.apiService.get(`users`).subscribe({
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
          this.setMessage('User deleted successfully', 3000, 'error');
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

}
