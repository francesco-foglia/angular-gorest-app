import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
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

  postForm: FormGroup = new FormGroup({});
  newPost: any = {
    title: '',
    body: '',
  };

  total: number = 0;
  pages: number = 0;
  page: number = 0;
  limit: number = 0;

  searchTitle: string = '';
  searchText: string = '';

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getPosts();

    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  getPosts() {
    this.spinner = true;
    this.apiService.get(`posts?title=${this.searchTitle}&body=${this.searchText}&page=${this.currentPage}&per_page=${this.resultsPerPage}`).subscribe({
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
        this.setMessage('Error getting posts', 3000, 'error');
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

  clearTitle() {
    if (this.searchTitle !== '') {
      this.searchTitle = '';
      this.getPosts();
    }
  }

  clearText() {
    if (this.searchText !== '') {
      this.searchText = '';
      this.getPosts();
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

  addPost(postId: number, formDirective: any) {
    this.apiService.post(`users/${postId}/posts`, this.postForm.value).subscribe({
      next: (data: any) => {
        this.setMessage('Post added successfully', 3000, 'confirm');
        this.clearTitle();
        this.clearText();
        formDirective.resetForm();
        this.postForm.reset();
        this.currentPage = 1;
        this.getPosts();
      },
      error: (error) => {
        this.setMessage('Error adding post', 3000, 'error');
      }
    });
  }

}
