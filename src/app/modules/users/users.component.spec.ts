import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersComponent } from './users.component';
import { ApiService } from '../../services/api.service';
import { ElementRef } from '@angular/core';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['get', 'post', 'delete']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
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
    expect(component.userForm).toBeDefined();
    expect(component.currentPage).toEqual(1);
    expect(apiServiceSpy.get).toHaveBeenCalledWith(jasmine.any(String));
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  });

  it('should call searchUserName and update properties', () => {
    spyOn(component, 'getUsers');
    const searchName = 'John Doe';
    component.searchUserName(searchName);
    expect(component.searchName).toEqual(searchName);
    expect(component.currentPage).toEqual(1);
    expect(component.getUsers).toHaveBeenCalled();
  });

  it('should call searchUserEmail and update properties', () => {
    spyOn(component, 'getUsers');
    const searchEmail = 'john.doe@example.com';
    component.searchUserEmail(searchEmail);
    expect(component.searchEmail).toEqual(searchEmail);
    expect(component.currentPage).toEqual(1);
    expect(component.getUsers).toHaveBeenCalled();
  });

  it('should call previousPage and update properties', () => {
    spyOn(component, 'getUsers');
    const currentPage = 3;
    component.previousPage(currentPage);
    expect(component.currentPage).toEqual(currentPage);
    expect(component.getUsers).toHaveBeenCalled();
  });

  it('should call nextPage and update properties', () => {
    spyOn(component, 'getUsers');
    const currentPage = 3;
    component.nextPage(currentPage);
    expect(component.currentPage).toEqual(currentPage);
    expect(component.getUsers).toHaveBeenCalled();
  });

  it('should call firstPage and update properties', () => {
    spyOn(component, 'getUsers');
    const currentPage = 1;
    component.firstPage(currentPage);
    expect(component.currentPage).toEqual(currentPage);
    expect(component.getUsers).toHaveBeenCalled();
  });

  it('should call lastPage and update properties', () => {
    spyOn(component, 'getUsers');
    const currentPage = 100;
    component.lastPage(currentPage);
    expect(component.currentPage).toEqual(currentPage);
    expect(component.getUsers).toHaveBeenCalled();
  });

  it('should call setResultsPerPage and update properties', () => {
    spyOn(component, 'getUsers');
    const resultsPerPage = 20;
    component.setResultsPerPage(resultsPerPage);
    expect(component.resultsPerPage).toEqual(resultsPerPage);
    expect(component.getUsers).toHaveBeenCalled();
  });

  it('should call getUsers after adding a user successfully', () => {
    apiServiceSpy.post.and.returnValue(of({}));
    component.addUser();
    const mockHttpResponse: HttpResponse<any> = new HttpResponse({
      body: [],
      status: 200,
      headers: new HttpHeaders(),
    });
    apiServiceSpy.get.and.returnValue(of(mockHttpResponse));
    expect(apiServiceSpy.get).toHaveBeenCalled();
  });

  it('should add a user successfully', () => {
    apiServiceSpy.post.and.returnValue(of({}));
    component.addUser();
    expect(snackBarSpy.open).toHaveBeenCalledWith('User added successfully', '❌');
  });

  it('should handle error when adding user', () => {
    const errorResponse = { error: [{ message: 'has already been taken' }] };
    apiServiceSpy.post.and.returnValue(throwError(() => errorResponse));
    component.addUser();
    expect(snackBarSpy.open).toHaveBeenCalledWith(`User Email ${errorResponse.error[0].message}`, '❌');
  });

  it('should handle generic error when adding user', () => {
    const errorResponse = { error: [{ message: 'some other error' }] };
    apiServiceSpy.post.and.returnValue(throwError(() => errorResponse));
    component.addUser();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Error adding user', '❌');
  });

  it('should handle error when calling getUsers', fakeAsync(() => {
    const errorResponse = { error: 'Error getting users' };
    apiServiceSpy.get.and.returnValue(throwError(() => errorResponse));
    component.getUsers();
    tick();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Error getting users', '❌');
  }));

  it('should delete a user successfully', () => {
    apiServiceSpy.delete.and.returnValue(of({}));
    spyOn(window, 'confirm').and.returnValue(true);
    const userId = 1234567;
    component.deleteUser(userId);
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this user?');
    expect(snackBarSpy.open).toHaveBeenCalledWith('User deleted successfully', '❌');
  });

  it('should handle delete user error', () => {
    const errorResponse = { status: 500, message: 'Internal Server Error' };
    apiServiceSpy.delete.and.returnValue(throwError(() => errorResponse));
    spyOn(window, 'confirm').and.returnValue(true);
    const userId = 1234567;
    component.deleteUser(userId);
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this user?');
    expect(snackBarSpy.open).toHaveBeenCalledWith('Error deleting user', '❌');
    expect(component.disabled).toBe(false);
  });

  it('should call onClear when adding a user successfully', () => {
    const mockElementRef = new ElementRef(null);
    component.searchComponentRef = { onClear: jasmine.createSpy('onClear') } as any;
    spyOn(component, 'getUsers');
    apiServiceSpy.post.and.returnValue(of({}));
    component.addUser();
    expect(component.searchComponentRef.onClear).toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith('User added successfully', '❌');
    expect(component.getUsers).toHaveBeenCalled();
  });

});
