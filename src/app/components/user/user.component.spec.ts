import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { UserComponent } from './user.component';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let route: ActivatedRoute;
  let apiService: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => '' })
          }
        },
        {
          provide: ApiService,
          useValue: {
            get: () => of(new HttpResponse({ body: {} })),
            post: () => of({}),
          }
        },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);
    apiService = TestBed.inject(ApiService);

    // Spy on commentForm reset method
    spyOn(component.commentForm, 'reset');

    fixture.detectChanges();
  });

  it('should reset commentForm and close comments modal', fakeAsync(() => {
    const closeCommentsSpy = spyOn(component, 'closeComments');

    component.closeComments();
    tick(300);

    expect(component.modalComments).toBeFalse();
    expect(component.spinner).toBeFalse();
    expect(component.commentForm.reset).toHaveBeenCalled();
    expect(closeCommentsSpy).toHaveBeenCalled();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset commentForm and call getUserPosts() and getPostComments() on successful comment addition', fakeAsync(() => {
    spyOn(apiService, 'post').and.returnValue(of({}));
    const commentFormResetSpy = spyOn(component.commentForm, 'reset');
    const getUserPostsSpy = spyOn(component, 'getUserPosts');
    const getPostCommentsSpy = spyOn(component, 'getPostComments');

    component.addComment(1, {} as any);
    tick();

    expect(commentFormResetSpy).toHaveBeenCalled();
    expect(getUserPostsSpy).toHaveBeenCalled();
    expect(getPostCommentsSpy).toHaveBeenCalledWith(1);
  }));

  it('should handle error on addComment() and not call getUserPosts() or getPostComments()', fakeAsync(() => {
    spyOn(apiService, 'post').and.returnValue(throwError(() => { }));
    const commentFormResetSpy = spyOn(component.commentForm, 'reset');
    const getUserPostsSpy = spyOn(component, 'getUserPosts');
    const getPostCommentsSpy = spyOn(component, 'getPostComments');

    component.addComment(1, {} as any);
    tick();

    expect(commentFormResetSpy).not.toHaveBeenCalled();
    expect(getUserPostsSpy).not.toHaveBeenCalled();
    expect(getPostCommentsSpy).not.toHaveBeenCalled();
  }));

  it('should set userId to empty string when route param "id" is not present', fakeAsync(() => {
    spyOn(apiService, 'get').and.returnValue(of(new HttpResponse({ body: {} })));

    component.ngOnInit();
    tick();

    expect(component.userId).toEqual('');
  }));

  it('should handle error on getUserPosts()', fakeAsync(() => {
    // spyOn(apiService, 'get').and.returnValue(of({})); // Simulate an empty response to simulate an error
    spyOn(apiService, 'get').and.returnValue(of(new HttpResponse({ body: {} })));
    const setMessageSpy = spyOn(component, 'setMessage');

    component.getUserPosts();
    tick();

    expect(setMessageSpy).toHaveBeenCalledWith('Error getting posts', 2500, 'error');
  }));

  it('should handle error on getUserPosts() - HTTP error', fakeAsync(() => {
    const errorResponse = new HttpResponse({ status: 500, statusText: 'Internal Server Error' });
    spyOn(apiService, 'get').and.returnValue(throwError(() => errorResponse)); // Simulate an HTTP error
    const setMessageSpy = spyOn(component, 'setMessage');

    component.getUserPosts();
    tick();

    expect(setMessageSpy).toHaveBeenCalledWith('Error getting posts', 2500, 'error');
  }));

  it('should call getUser() on ngOnInit', fakeAsync(() => {
    const getUserSpy = spyOn(component, 'getUser').and.callThrough();

    component.ngOnInit();
    tick();

    expect(getUserSpy).toHaveBeenCalled();
  }));

  it('should fetch user data on getUser()', fakeAsync(() => {
    const userResponse = { id: 1, name: 'John Doe' }; // replace with sample user data
    spyOn(apiService, 'get').and.returnValue(of(new HttpResponse({ body: userResponse })));

    component.getUser();
    tick();

    expect(component.user).toEqual(userResponse);
  }));

  it('should handle error on getUser()', fakeAsync(() => {
    // spyOn(apiService, 'get').and.returnValue(of({})); // Simula una risposta vuota per simulare un errore
    spyOn(apiService, 'get').and.returnValue(of(new HttpResponse({ body: {} })));
    const setMessageSpy = spyOn(component, 'setMessage');

    component.getUser();
    tick();

    expect(setMessageSpy).toHaveBeenCalledWith('Error getting user', 2500, 'error');
  }));

  it('should handle error on getUser() - HTTP error', fakeAsync(() => {
    const errorResponse = new HttpResponse({ status: 500, statusText: 'Internal Server Error' });
    spyOn(apiService, 'get').and.returnValue(throwError(() => errorResponse)); // Simula un errore HTTP
    const setMessageSpy = spyOn(component, 'setMessage');

    component.getUser();
    tick();

    expect(setMessageSpy).toHaveBeenCalledWith('Error getting user', 2500, 'error');
  }));

  it('should handle error on getPostComments()', fakeAsync(() => {
    spyOn(apiService, 'get').and.returnValue(of(new HttpResponse({ body: {} }))); // Simula una risposta vuota per simulare un errore
    const setMessageSpy = spyOn(component, 'setMessage');

    component.getPostComments(1);
    tick();

    expect(setMessageSpy).toHaveBeenCalledWith('Error getting comments', 2500, 'error');
  }));

  it('should handle error on getPostComments() - HTTP error', fakeAsync(() => {
    const errorResponse = new HttpResponse({ status: 500, statusText: 'Internal Server Error' });
    spyOn(apiService, 'get').and.returnValue(throwError(() => errorResponse)); // Simula un errore HTTP
    const setMessageSpy = spyOn(component, 'setMessage');

    component.getPostComments(1);
    tick();

    expect(setMessageSpy).toHaveBeenCalledWith('Error getting comments', 2500, 'error');
  }));

  it('should fetch comments on getPostComments()', fakeAsync(() => {
    const commentsResponse = [{ id: 1, text: 'Great post!' }]; // Sostituisci con dati di esempio
    spyOn(apiService, 'get').and.returnValue(of(new HttpResponse({ body: commentsResponse })));

    component.getPostComments(1);
    tick();

    expect(component.comments).toEqual(commentsResponse);
    expect(component.modalComments).toBeTruthy();
  }));

  it('should handle error on addComment()', fakeAsync(() => {
    spyOn(apiService, 'post').and.returnValue(throwError(() => { })); // Simula un errore durante l'invio del commento
    const setMessageSpy = spyOn(component, 'setMessage');

    component.addComment(1, {} as any);
    tick();

    expect(setMessageSpy).toHaveBeenCalledWith('Error adding comment', 2500, 'error');
  }));

  it('should add comment successfully on addComment()', fakeAsync(() => {
    const commentResponse = { id: 1, text: 'Great comment!' }; // Sostituisci con dati di esempio
    spyOn(apiService, 'post').and.returnValue(of(commentResponse));
    const setMessageSpy = spyOn(component, 'setMessage');
    const getUserPostsSpy = spyOn(component, 'getUserPosts');
    const getPostCommentsSpy = spyOn(component, 'getPostComments');

    component.addComment(1, {} as any);
    tick();

    expect(setMessageSpy).toHaveBeenCalledWith('Comment added successfully', 2500, 'confirm');
    expect(component.commentForm.reset).toHaveBeenCalled(); // Verifica se il metodo reset è stato chiamato
    expect(getUserPostsSpy).toHaveBeenCalled(); // Verifica se il metodo getUserPosts è stato chiamato
    expect(getPostCommentsSpy).toHaveBeenCalledWith(1); // Verifica se il metodo getPostComments è stato chiamato con il postId corretto
  }));

  it('should reset commentForm and close comments modal', fakeAsync(() => {
    component.spinner = true;

    component.closeComments();
    tick(300);

    expect(component.modalComments).toBeFalse();
    expect(component.spinner).toBeFalse();
    expect(component.commentForm.reset).toHaveBeenCalled();
  }));

  it('should clear confirmMessage after the specified duration', fakeAsync(() => {
    const duration = 2500;
    const message = 'Test Confirm Message';

    component.setMessage(message, duration, 'confirm');
    expect(component.confirmMessage).toEqual(message);

    tick(duration);
    expect(component.confirmMessage).toEqual('');
  }));

  it('should clear errorMessage after the specified duration', fakeAsync(() => {
    const duration = 2500;
    const message = 'Test Error Message';

    component.setMessage(message, duration, 'error');
    expect(component.errorMessage).toEqual(message);

    tick(duration);
    expect(component.errorMessage).toEqual('');
  }));

  it('should set userId to an empty string when route param "id" is an empty string', () => {
    expect(component.userId).toEqual('');
  });

});
