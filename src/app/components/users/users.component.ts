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
  users: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    const token = sessionStorage.getItem('token');

    this.apiService.get(`users?access-token=${token}`).subscribe({
      next: (data: any) => {
        this.users = data;
        this.confirmMessage = 'Users retrieved successfully';
      },
      error: (error) => {
        this.errorMessage = 'Error retrieving users';
      }
    });
  }

}
