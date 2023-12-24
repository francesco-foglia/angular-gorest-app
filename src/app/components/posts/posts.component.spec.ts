import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PostsComponent } from './posts.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get']);

    TestBed.configureTestingModule({
      declarations: [PostsComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ApiService, useValue: spy },
        FormBuilder
      ],
    });
    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getPostComments', () => {
    it('should get comments successfully', fakeAsync(() => {
      const postId = 1;
      const comments = [{ id: 1, text: 'Comment 1' }, { id: 2, text: 'Comment 2' }];
      const httpResponse: HttpResponse<any> = new HttpResponse<any>({
        body: comments,
        headers: {
          get: (header: string) => '2', // Assuming 2 comments
        } as any,
      });

      apiServiceSpy.get.and.returnValue(of(httpResponse));

      component.getPostComments(postId);
      tick();

      expect(apiServiceSpy.get).toHaveBeenCalledWith(`posts/${postId}/comments`);
      expect(component.comments).toEqual(comments);
      expect(component.modalComments).toBe(true);
      expect(component.spinner).toBe(false);
    }));

    it('should handle error by setting error message', fakeAsync(() => {
      const postId = 1;
      const errorMessage = 'Error getting comments';
      apiServiceSpy.get.and.returnValue(throwError(() => errorMessage));

      component.getPostComments(postId);
      tick();

      expect(apiServiceSpy.get).toHaveBeenCalledOnceWith(`posts/${postId}/comments`);
      expect(component.comments).toEqual([]);
      expect(component.errorMessage).toEqual(errorMessage);
    }));
  });

  describe('ngOnInit', () => {
    it('should initialize the form and call getPosts', () => {
      const formBuilder = TestBed.inject(FormBuilder);
      const formGroupSpy = spyOn(formBuilder, 'group').and.callThrough();
      const getPostsSpy = spyOn(component, 'getPosts');

      component.ngOnInit();

      expect(formGroupSpy).toHaveBeenCalledOnceWith({
        title: ['', Validators.required],
        body: ['', Validators.required],
      }, {}); // or expect(formGroupSpy).toHaveBeenCalledOnceWith({...}, {});
      expect(getPostsSpy).toHaveBeenCalledOnceWith();
    });
  });

  describe('closeComments', () => {
    it('should close comments modal after a delay', fakeAsync(() => {
      component.spinner = false;
      component.modalComments = true;

      component.closeComments();

      expect(component.spinner).toBe(true);

      // Simulate the passage of time (300ms timeout in closeComments)
      tick(300);

      expect(component.modalComments).toBe(false);
      expect(component.spinner).toBe(false);
    }));
  });

  describe('searchPostTitle', () => {
    it('should update searchTitle and call getPosts', () => {
      const search = 'Test Search';
      const getPostsSpy = spyOn(component, 'getPosts');

      component.searchPostTitle(search);

      expect(component.searchTitle).toEqual(search);
      expect(component.currentPage).toEqual(1);
      expect(getPostsSpy).toHaveBeenCalledOnceWith();
    });
  });

  describe('searchPostText', () => {
    it('should update searchText and call getPosts', () => {
      const search = 'Test Search';
      const getPostsSpy = spyOn(component, 'getPosts');

      component.searchPostText(search);

      expect(component.searchText).toEqual(search);
      expect(component.currentPage).toEqual(1);
      expect(getPostsSpy).toHaveBeenCalledOnceWith();
    });
  });

  describe('previousPage', () => {
    it('should decrement currentPage and call getPosts when currentPage is greater than 1', () => {
      component.currentPage = 3;
      const getPostsSpy = spyOn(component, 'getPosts');

      component.previousPage();

      expect(component.currentPage).toEqual(2);
      expect(getPostsSpy).toHaveBeenCalledOnceWith();
    });

    it('should not decrement currentPage or call getPosts when currentPage is 1', () => {
      component.currentPage = 1;
      const getPostsSpy = spyOn(component, 'getPosts');

      component.previousPage();

      expect(component.currentPage).toEqual(1);
      expect(getPostsSpy).not.toHaveBeenCalled();
    });
  });

  describe('nextPage', () => {
    it('should increment currentPage and call getPosts when posts.length is equal to resultsPerPage', () => {
      component.currentPage = 2;
      component.resultsPerPage = 5;
      component.posts = new Array(5); // Assuming posts.length is equal to resultsPerPage
      const getPostsSpy = spyOn(component, 'getPosts');

      component.nextPage();

      expect(component.currentPage).toEqual(3);
      expect(getPostsSpy).toHaveBeenCalledOnceWith();
    });

    it('should not increment currentPage or call getPosts when posts.length is less than resultsPerPage', () => {
      component.currentPage = 2;
      component.resultsPerPage = 5;
      component.posts = new Array(3); // Assuming posts.length is less than resultsPerPage
      const getPostsSpy = spyOn(component, 'getPosts');

      component.nextPage();

      expect(component.currentPage).toEqual(2);
      expect(getPostsSpy).not.toHaveBeenCalled();
    });
  });

  describe('paginationResults', () => {
    it('should return correct pagination results string for first page', () => {
      component.currentPage = 1;
      component.resultsPerPage = 10;
      component.total = 25;

      const result = component.paginationResults();

      expect(result).toEqual('1 - 10 of 25');
    });

    it('should return correct pagination results string for last page', () => {
      component.currentPage = 3;
      component.resultsPerPage = 10;
      component.total = 25;

      const result = component.paginationResults();

      expect(result).toEqual('21 - 25 of 25');
    });
  });

  describe('setMessage', () => {
    it('should set confirmMessage and clear it after a delay for confirm type', fakeAsync(() => {
      const message = 'Test Confirm Message';
      const duration = 2500;

      component.setMessage(message, duration, 'confirm');

      expect(component.confirmMessage).toEqual(message);

      // Simulate the passage of time (2500ms timeout in setMessage)
      tick(duration);

      expect(component.confirmMessage).toEqual('');
    }));

    it('should set errorMessage and clear it after a delay for error type', fakeAsync(() => {
      const message = 'Test Error Message';
      const duration = 2500;

      component.setMessage(message, duration, 'error');

      expect(component.errorMessage).toEqual(message);

      // Simulate the passage of time (2500ms timeout in setMessage)
      tick(duration);

      expect(component.errorMessage).toEqual('');
    }));
  });

  describe('getPosts', () => {
    it('should update posts property with response body', fakeAsync(() => {
      const mockPosts = [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }];
      const httpResponse: HttpResponse<any> = new HttpResponse<any>({
        body: mockPosts,
        headers: {
          get: (header: string) => '2', // Assuming 2 posts
        } as any,
      });

      apiServiceSpy.get.and.returnValue(of(httpResponse));

      component.getPosts();
      tick();

      expect(apiServiceSpy.get).toHaveBeenCalledOnceWith(`posts?title=&body=&page=1&per_page=20`);
      expect(component.posts).toEqual(mockPosts);
    }));

    it('should handle error by setting error message', fakeAsync(() => {
      const errorMessage = 'Error getting posts';
      apiServiceSpy.get.and.returnValue(throwError(() => errorMessage));

      component.getPosts();
      tick();

      expect(apiServiceSpy.get).toHaveBeenCalledOnceWith(`posts?title=&body=&page=1&per_page=20`);
      expect(component.posts).toEqual([]);
      expect(component.errorMessage).toEqual(errorMessage);
    }));
  });

});
