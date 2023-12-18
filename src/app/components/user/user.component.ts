import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  confirmMessage: string = '';
  errorMessage: string = '';
  spinner: boolean = false;
  body: any = document.getElementsByTagName('body')[0];
  userId: string = '';
  user: any = {};

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id') || '';
      this.getUser();
    });
  }

  getUser() {
    this.toggleSpinner();

    this.apiService.get(`users/${this.userId}`).subscribe({
      next: (response: HttpResponse<any>) => {
        this.user = response.body;
        console.log(this.user);
        this.toggleSpinner();
      },
      error: (error) => {
        this.setMessage('Error getting user', 3000, 'error');
        this.toggleSpinner();
      }
    });
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

  toggleSpinner() {
    this.spinner = !this.spinner;
    this.body.classList.toggle('overflow-html');
  }

}
