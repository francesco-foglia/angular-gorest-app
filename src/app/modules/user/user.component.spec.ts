import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserComponent } from './user.component';
import { ApiService } from 'src/app/services/api.service';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['get', 'post']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      declarations: [UserComponent],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: { paramMap: of({ get: () => '1234567' }) } },
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUser and update user property on successful API response', fakeAsync(() => {
    const mockUserResponse = { id: 1234567, name: 'John Doe', email: 'john.doe@example.com', gender: 'male', status: 'active' };
    apiServiceSpy.get.and.returnValue(of(new HttpResponse({ body: mockUserResponse })));
    component.ngOnInit();
    tick();
    expect(apiServiceSpy.get).toHaveBeenCalledWith('users/1234567');
    expect(component.user).toEqual(mockUserResponse);
    expect(component.spinner).toBeFalsy();
  }));

  it('should call getPostComments and update comments property on successful API response', fakeAsync(() => {
    const mockCommentsResponse = [
      { id: 12346, post_id: 12345, name: 'Name 1', email: 'email1@email.com', body: 'Comment 1' },
      { id: 12347, post_id: 12345, name: 'Name 2', email: 'email2@email.com', body: 'Comment 2' }
    ];
    const postId = 12345;
    apiServiceSpy.get.and.returnValue(of(new HttpResponse({ body: mockCommentsResponse })));
    component.getPostComments(postId);
    tick();
    expect(apiServiceSpy.get).toHaveBeenCalledWith(`posts/${postId}/comments`);
    expect(component.comments).toEqual(mockCommentsResponse);
    expect(component.modalComments).toBeTruthy();
    expect(component.spinner).toBeFalsy();
  }));

  it('should set modalComments to false after a delay when closeComments is called', fakeAsync(() => {
    component.modalComments = true;
    component.closeComments();
    expect(component.spinner).toBeTruthy();
    tick(300);
    expect(component.modalComments).toBeFalsy();
    expect(component.spinner).toBeFalsy();
  }));

  it('should activate spinner immediately when closeComments is called', () => {
    component.closeComments();
    expect(component.spinner).toBeTruthy();
  });

  it('should handle error when calling getUser', fakeAsync(() => {
    const errorResponse = { error: 'Error getting user' };
    apiServiceSpy.get.and.returnValue(throwError(() => errorResponse));
    component.getUser();
    tick();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Error getting user', '❌');
  }));

  it('should handle error when calling getUserPosts', fakeAsync(() => {
    const errorResponse = { error: 'Error getting posts' };
    apiServiceSpy.get.and.returnValue(throwError(() => errorResponse));
    component.getUserPosts();
    tick();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Error getting posts', '❌');
  }));

  it('should handle error when calling getPostComments', fakeAsync(() => {
    const errorResponse = { error: 'Error getting comments' };
    apiServiceSpy.get.and.returnValue(throwError(() => errorResponse));
    const post_id = 12345;
    component.getPostComments(post_id);
    tick();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Error getting comments', '❌');
  }));

  it('should add a comment successfully', () => {
    apiServiceSpy.post.and.returnValue(of({}));
    const post_id = 12345;
    component.addComment(post_id);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Comment added successfully', '❌');
  });

  it('should handle generic error when adding comment', () => {
    const errorResponse = { error: [{ message: 'some other error' }] };
    apiServiceSpy.post.and.returnValue(throwError(() => errorResponse));
    const post_id = 12345;
    component.addComment(post_id);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Error adding comment', '❌');
  });

  it('should add a post successfully', () => {
    apiServiceSpy.post.and.returnValue(of({}));
    const postId = 12345;
    component.addPost(postId);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Post added successfully', '❌');
  });

  it('should handle generic error when adding post', () => {
    const errorResponse = { error: [{ message: 'some other error' }] };
    apiServiceSpy.post.and.returnValue(throwError(() => errorResponse));
    const postId = 12345;
    component.addPost(postId);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Error adding post', '❌');
  });

});
