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
  posts: any = [];
  comments: any = [];
  hideForm: { [postId: number]: boolean } = {};
  hideComments: { [postId: number]: boolean } = {};
  selectedPostId!: number;

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

    this.commentForm = new FormGroup({
      body: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  getUser() {
    this.toggleSpinner();

    this.apiService.get(`users/${this.userId}`).subscribe({
      next: (response: HttpResponse<any>) => {
        this.user = response.body;
        console.log('user', this.user);
        this.toggleSpinner();
      },
      error: (error) => {
        this.setMessage('Error getting user', 3000, 'error');
        this.toggleSpinner();
      }
    });
  }

  getUserPosts() {
    this.toggleSpinner();

    this.apiService.get(`users/${this.userId}/posts`).subscribe({
      next: (data) => {
        console.log('posts', data.body);
        this.posts = data.body;

        this.posts.forEach((post: any) => {
          post.comments = [];
          this.apiService.get(`posts/${post.id}/comments`).subscribe({
            next: (commentsData) => {
              console.log('comments', commentsData.body);
              post.comments = commentsData.body;

              if (!post.comments.length) {
                this.noCommentsMessage = 'There are no comments associated with this post';
              }

            },
            error: (error) => {
              console.error('Error getting comments', error);
            }
          });
        });

        this.toggleSpinner();
        if (!this.posts.length) {
          this.noPostsMessage = 'There are no posts associated with this user';
        }
      },
      error: (error) => {
        this.setMessage('Error getting posts', 3000, 'error');
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
  }

  toggleForm(postId: number) {
    this.hideForm[postId] = !this.hideForm[postId];
  }

  toggleComments(postId: number) {
    this.hideComments[postId] = !this.hideComments[postId];
  }

  addComment(post_id: number) {
    const postId = post_id;

    if (postId !== null) {
      this.apiService.post(`posts/${postId}/comments`, this.commentForm.value).subscribe({
        next: (data: any) => {
          this.setMessage('Comment created successfully', 3000, 'confirm');
          this.commentForm.reset();
          this.toggleForm(postId);
          this.getUserPosts();
        },
        error: (error) => {
          this.toggleSpinner();
          this.setMessage('Error adding comment', 3000, 'error');
          this.toggleSpinner();
        }
      });
    }
  }

}
