import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  posts: any[] = [];
  currentPage: number = 1;
  resultsPerPage: number = 20;
  spinner: boolean = false;
  confirmMessage: string = '';
  errorMessage: string = '';

  total: number = 0;
  pages: number = 0;
  page: number = 0;
  limit: number = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.spinner = true;
    this.apiService.get(`posts?page=${this.currentPage}&per_page=${this.resultsPerPage}`).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log(response.body);

        const headers = response.headers;

        this.total = +headers.get('X-Pagination-Total')!;
        this.pages = +headers.get('X-Pagination-Pages')!;
        this.page = +headers.get('X-Pagination-Page')!;
        this.limit = +headers.get('X-Pagination-Limit')!;

        this.pages = Math.ceil(this.total / this.resultsPerPage);

        this.posts = response.body;
      },
      error: (error) => {
        this.setMessage('Error getting users', 3000, 'error');
      },
      complete: () => {
        this.spinner = false;
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

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getPosts();
    }
  }

  nextPage() {
    if (this.posts.length === this.resultsPerPage) {
      this.currentPage++;
      this.getPosts();
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
