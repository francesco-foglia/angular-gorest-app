import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { PostsComponent } from './posts.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['get', 'post']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [PostsComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component', () => {
    const mockHttpResponse: HttpResponse<any> = new HttpResponse({
      body: [],
      status: 200,
      headers: new HttpHeaders(),
    });
    apiServiceSpy.get.and.returnValue(of(mockHttpResponse));
    component.ngOnInit();
    expect(component.postForm).toBeDefined();
    expect(component.currentPage).toEqual(1);
    expect(apiServiceSpy.get).toHaveBeenCalledWith(jasmine.any(String));
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('should get post comments', () => {
    const postId = 12345;
    const mockComments = [
      { id: 12346, post_id: 12345, name: 'Name 1', email: 'email1@email.com', body: 'Comment 1' },
      { id: 12347, post_id: 12345, name: 'Name 2', email: 'email2@email.com', body: 'Comment 2' }
    ];
    const mockHttpResponse: HttpResponse<any> = new HttpResponse({
      body: mockComments,
      status: 200,
      headers: new HttpHeaders(),
    });
    apiServiceSpy.get.and.returnValue(of(mockHttpResponse));
    component.getPostComments(postId);
    expect(component.selectedPostId).toEqual(postId);
    expect(apiServiceSpy.get).toHaveBeenCalledWith(`posts/${postId}/comments`);
    fixture.detectChanges();
    expect(component.comments).toEqual(mockComments);
    expect(component.modalComments).toBeFalsy();
    expect(component.spinner).toBeFalsy();
  });

  it('should close comments with a delay', fakeAsync(() => {
    component.spinner = false;
    component.modalComments = true;
    component.closeComments();
    expect(component.spinner).toBeTruthy();
    tick(300);
    expect(component.modalComments).toBeFalsy();
    expect(component.spinner).toBeFalsy();
  }));

  it('should call searchPostTitle and update properties', () => {
    spyOn(component, 'getPosts');
    const searchTitle = 'Lorem ipsum';
    component.searchPostTitle(searchTitle);
    expect(component.searchTitle).toEqual(searchTitle);
    expect(component.currentPage).toEqual(1);
    expect(component.getPosts).toHaveBeenCalled();
  });

  it('should call searchPostText and update properties', () => {
    spyOn(component, 'getPosts');
    const searchText = 'Lorem ipsum';
    component.searchPostText(searchText);
    expect(component.searchText).toEqual(searchText);
    expect(component.currentPage).toEqual(1);
    expect(component.getPosts).toHaveBeenCalled();
  });

  it('should call previousPage and update properties', () => {
    spyOn(component, 'getPosts');
    const currentPage = 3;
    component.previousPage(currentPage);
    expect(component.currentPage).toEqual(currentPage);
    expect(component.getPosts).toHaveBeenCalled();
  });

  it('should call nextPage and update properties', () => {
    spyOn(component, 'getPosts');
    const currentPage = 3;
    component.nextPage(currentPage);
    expect(component.currentPage).toEqual(currentPage);
    expect(component.getPosts).toHaveBeenCalled();
  });

  it('should handle error when getting posts', () => {
    const errorResponse = { status: 500, statusText: 'Internal Server Error' };
    apiServiceSpy.get.and.returnValue(throwError(() => errorResponse));
    component.getPosts();
    expect(apiServiceSpy.get).toHaveBeenCalledWith(jasmine.any(String));
    expect(snackBarSpy.open).toHaveBeenCalledWith('Error getting posts', '❌');
  });

  it('should handle error when getting comments', fakeAsync(() => {
    const postId = 12345;
    const errorResponse = { status: 500, statusText: 'Internal Server Error' };
    apiServiceSpy.get.and.returnValue(throwError(() => errorResponse));
    component.getPostComments(postId);
    tick();
    expect(apiServiceSpy.get).toHaveBeenCalledWith(`posts/${postId}/comments`);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Error getting comments', '❌');
  }));

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
