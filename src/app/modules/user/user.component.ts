import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  noPostsMessage: string = '';
  spinner: boolean = false;
  userId: string = '';
  user: any = {};
  posts: any[] = [];
  comments: any[] = [];
  selectedPostId!: number;
  modalComments: boolean = false;

  commentForm: FormGroup = new FormGroup({});
  newComment: any = {
    body: '',
    name: '',
    email: '',
  };

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private apiService: ApiService, public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id') || '';
      this.getUser();
      this.getUserPosts();
    });

    this.commentForm = this.formBuilder.group({
      body: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  getUser() {
    this.spinner = true;
    this.apiService.get(`users/${this.userId}`).subscribe({
      next: (response: HttpResponse<any>) => {
        this.user = response.body;
      },
      error: (error) => {
        this._snackBar.open('Error getting user', '❌');
      },
      complete: () => {
        this.spinner = false;
      }
    });
  }

  getUserPosts() {
    this.spinner = true;
    this.apiService.get(`users/${this.userId}/posts`).subscribe({
      next: (response: HttpResponse<any>) => {
        this.posts = response.body;
        if (!this.posts.length) {
          this.noPostsMessage = 'There are no posts published by this user';
        }
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

  addComment(postId: number, formDirective: any) {
    this.apiService.post(`posts/${postId}/comments`, this.commentForm.value).subscribe({
      next: (data: any) => {
        this._snackBar.open('Comment added successfully', '❌');
        formDirective.resetForm();
        this.commentForm.reset();
        this.getUserPosts();
        this.getPostComments(postId);
      },
      error: (error) => {
        this._snackBar.open('Error adding comment', '❌');
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

}
