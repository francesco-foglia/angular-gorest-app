import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  posts: any[] = [];
  comments: any[] = [];
  currentPage: number = 1;
  resultsPerPage: number = 20;
  spinner: boolean = false;

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

  selectedPostId!: number;
  modalComments: boolean = false;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, public _snackBar: MatSnackBar) { }

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

        const headers = response.headers;

        this.total = +headers.get('X-Pagination-Total')!;
        this.pages = +headers.get('X-Pagination-Pages')!;
        this.page = +headers.get('X-Pagination-Page')!;
        this.limit = +headers.get('X-Pagination-Limit')!;

        this.pages = Math.ceil(this.total / this.resultsPerPage);

        this.posts = response.body;
        this.modalComments = false;
      },
      error: (error) => {
        this._snackBar.open('Error getting posts', '❌');
      },
      complete: () => {
        this.spinner = false;
      }
    });
  }

  getPostComments(postId: number,) {
    this.spinner = true;
    this.selectedPostId = postId;
    this.apiService.get(`posts/${postId}/comments`).subscribe({
      next: (response: HttpResponse<any>) => {
        this.comments = response.body;
        this.modalComments = true;
      },
      error: (error) => {
        this._snackBar.open('Error getting comments', '❌');
      },
      complete: () => {
        this.spinner = false;
      }
    });
  }

  addPost(postId: number, formDirective: any) {
    this.apiService.post(`users/${postId}/posts`, this.postForm.value).subscribe({
      next: (data: any) => {
        this._snackBar.open('Post added successfully', '❌');
        this.searchTitle = '';
        this.searchText = '';
        formDirective.resetForm();
        this.postForm.reset();
        this.currentPage = 1;
        this.getPosts();
      },
      error: (error) => {
        this._snackBar.open('Error adding post', '❌');
      }
    });
  }

  closeComments() {
    this.spinner = true;
    setTimeout(() => {
      this.modalComments = false;
      this.spinner = false;
    }, 300);
  }

  searchPostTitle(search: string) {
    this.searchTitle = search;
    this.currentPage = 1;
    this.getPosts();
  }

  searchPostText(search: string) {
    this.searchText = search;
    this.currentPage = 1;
    this.getPosts();
  }

  previousPage(currentPage: number) {
    this.currentPage = currentPage;
    this.getPosts();
  }

  nextPage(currentPage: number) {
    this.currentPage = currentPage;
    this.getPosts();
  }

}
