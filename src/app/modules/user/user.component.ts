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

  postForm: FormGroup = new FormGroup({});
  newPost: any = {
    title: '',
    body: '',
  };

  commentForm: FormGroup = new FormGroup({});
  newComment: any = {
    body: '',
    name: '',
    email: '',
  };

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private apiService: ApiService, public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id') as string;
      this.getUser();
      this.getUserPosts();
    });

    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
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

    const observable = this.apiService.get(`users/${this.userId}/posts`);

    if (observable) {
      observable.subscribe({
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
  }

  getPostComments(postId: number,) {
    this.spinner = true;
    this.selectedPostId = postId;

    const observable = this.apiService.get(`posts/${postId}/comments`);

    if (observable) {
      observable.subscribe({
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
  }

  addPost(postId: number) {
    this.apiService.post(`users/${postId}/posts`, this.postForm.value).subscribe({
      next: (data: any) => {
        this._snackBar.open('Post added successfully', '❌');
        this.postForm.reset();
        this.getUserPosts();
      },
      error: (error) => {
        this._snackBar.open('Error adding post', '❌');
      }
    });
  }

  addComment(postId: number) {
    this.apiService.post(`posts/${postId}/comments`, this.commentForm.value).subscribe({
      next: (data: any) => {
        this._snackBar.open('Comment added successfully', '❌');
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
