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

  userId: string = '';
  user: any;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id') || '';
      this.getUser();
    });
  }

  getUser() {
    this.apiService.get(`users/${this.userId}`).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log(response.body);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
