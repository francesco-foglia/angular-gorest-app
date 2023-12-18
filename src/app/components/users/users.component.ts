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
    const token = sessionStorage.getItem('token');

    this.apiService.get(`users?access-token=${token}`).subscribe({
      next: (data: any) => {
        this.users = data;
        this.setMessage('Users retrieved successfully', 3000, 'confirm');
        this.toggleSpinner();
      },
      error: (error) => {
        this.setMessage('Error retrieving users', 3000, 'error');
        this.toggleSpinner();
      }
    });
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
