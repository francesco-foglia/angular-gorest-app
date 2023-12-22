import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
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
  noPostsMessage: string = '';
  noCommentsMessage: string = '';
  spinner: boolean = false;
  userId: string = '';
  user: any = {};
  posts: any[] = [];
  comments: any[] = [];
  selectedPostId!: number;
  modalComments: boolean = false;
  loaded: boolean = false;

  commentForm: FormGroup = new FormGroup({});
  newComment: any = {
    body: '',
    name: '',
    email: '',
  };

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private apiService: ApiService) { }

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
        this.setMessage('Error getting user', 3000, 'error');
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

        this.posts.forEach((post: any) => {
          post.comments = [];
          this.apiService.get(`posts/${post.id}/comments`).subscribe({
            next: (commentsData) => {
              post.comments = commentsData.body;
              this.loaded = true;

              if (!post.comments.length) {
                this.noCommentsMessage = 'Comments (0)';
              }

            },
            error: (error) => {
              this.setMessage('Error getting comments', 3000, 'error');
            }
          });
        });

        if (!this.posts.length) {
          this.noPostsMessage = 'There are no posts published by this user';
        }
      },
      error: (error) => {
        this.setMessage('Error getting posts', 3000, 'error');
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
        if (!this.comments.length) {
          this.noCommentsMessage = 'Comments (0)';
        }
      },
      error: (error) => {
        this.setMessage('Error getting comments', 3000, 'error');
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

  addComment(postId: number, formDirective: any) {
    this.apiService.post(`posts/${postId}/comments`, this.commentForm.value).subscribe({
      next: (data: any) => {
        this.setMessage('Comment added successfully', 3000, 'confirm');
        formDirective.resetForm();
        this.commentForm.reset();
        this.getUserPosts();
        this.getPostComments(postId);
      },
      error: (error) => {
        this.setMessage('Error adding comment', 3000, 'error');
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
