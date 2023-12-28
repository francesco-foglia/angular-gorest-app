import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserComponent } from './user.component';
import { ApiService } from 'src/app/services/api.service';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['get']);
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

});
