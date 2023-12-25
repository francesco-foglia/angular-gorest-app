import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { HttpResponse } from '@angular/common/http';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['get', 'post', 'delete']);

    TestBed.configureTestingModule({
      declarations: [UsersComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: ApiService, useValue: apiSpy }, FormBuilder],
    });

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUsers on ngOnInit', fakeAsync(() => {
    spyOn(component, 'getUsers');
    component.ngOnInit();
    tick();
    expect(component.getUsers).toHaveBeenCalled();
  }));

  it('should set userForm correctly on ngOnInit', () => {
    component.ngOnInit();
    expect(component.userForm.get('name')).toBeTruthy();
    expect(component.userForm.get('email')).toBeTruthy();
    expect(component.userForm.get('gender')).toBeTruthy();
    expect(component.userForm.get('status')).toBeTruthy();
  });

  it('should call API service to get users and update component properties', fakeAsync(() => {
    const mockResponse: HttpResponse<any> = {
      body: [{ id: 1, name: 'John Doe' }],
      headers: {
        get: (key: string) => {
          if (key === 'X-Pagination-Total') return '1';
          if (key === 'X-Pagination-Pages') return '1';
          if (key === 'X-Pagination-Page') return '1';
          if (key === 'X-Pagination-Limit') return '20';
          return null;
        },
      } as any,
      status: 200,
      statusText: 'OK',
      type: 4,
      url: '',
      clone: function (): HttpResponse<any> {
        throw new Error('Function not implemented.');
      },
      ok: false
    };
    apiService.get.and.returnValue(of(mockResponse));

    component.getUsers();
    tick();

    expect(component.spinner).toBe(false);
    expect(component.total).toBe(1);
    expect(component.pages).toBe(1);
    expect(component.page).toBe(1);
    expect(component.limit).toBe(20);
    expect(component.users).toEqual([{ id: 1, name: 'John Doe' }]);
  }));

  it('should call searchUserName and update searchName and currentPage', () => {
    const searchName = 'John';
    const spyGetUsers = spyOn(component, 'getUsers');

    component.searchUserName(searchName);

    expect(component.searchName).toEqual(searchName);
    expect(component.currentPage).toEqual(1);
    expect(spyGetUsers).toHaveBeenCalledOnceWith();
  });

  it('should call searchUserEmail and update searchEmail and currentPage', () => {
    const searchEmail = 'john@example.com';
    const spyGetUsers = spyOn(component, 'getUsers');

    component.searchUserEmail(searchEmail);

    expect(component.searchEmail).toEqual(searchEmail);
    expect(component.currentPage).toEqual(1);
    expect(spyGetUsers).toHaveBeenCalledOnceWith();
  });

  it('should call deleteUser and update disabled flag', fakeAsync(() => {
    const userId = 1;
    const spyConfirm = spyOn(window, 'confirm').and.returnValue(true);
    const spyGetUsers = spyOn(component, 'getUsers').and.stub();

    component.deleteUser(userId);
    tick(); // attendi la risoluzione della chiamata asincrona

    expect(spyConfirm).toHaveBeenCalledWith('Are you sure you want to delete this user?');
    expect(component.disabled).toBe(true);
    expect(apiService.delete).toHaveBeenCalledWith(`users/${userId}`);
    expect(spyGetUsers).toHaveBeenCalled();
    expect(component.disabled).toBe(false); // Assicurati che la flag disabled sia aggiornata correttamente dopo la chiamata asincrona
  }));

  it('should call previousPage and update currentPage if currentPage > 1', () => {
    component.currentPage = 3;
    const spyGetUsers = spyOn(component, 'getUsers');

    component.previousPage();

    expect(component.currentPage).toEqual(2);
    expect(spyGetUsers).toHaveBeenCalled();
  });

  it('should not decrement currentPage if currentPage is 1', () => {
    component.currentPage = 1;
    const spyGetUsers = spyOn(component, 'getUsers');

    component.previousPage();

    expect(component.currentPage).toEqual(1);
    expect(spyGetUsers).not.toHaveBeenCalled();
  });

  it('should call nextPage and update currentPage if users.length === resultsPerPage', () => {
    component.currentPage = 2;
    component.resultsPerPage = 20;
    component.users = new Array(20).fill({}); // Simula una pagina completa
    const spyGetUsers = spyOn(component, 'getUsers');

    component.nextPage();

    expect(component.currentPage).toEqual(3);
    expect(spyGetUsers).toHaveBeenCalled();
  });

  it('should not increment currentPage if users.length !== resultsPerPage', () => {
    component.currentPage = 2;
    component.resultsPerPage = 20;
    component.users = new Array(15).fill({}); // Simula una pagina incompleta
    const spyGetUsers = spyOn(component, 'getUsers');

    component.nextPage();

    expect(component.currentPage).toEqual(2);
    expect(spyGetUsers).not.toHaveBeenCalled();
  });

  it('should set confirmMessage and reset after duration for confirm message', fakeAsync(() => {
    const message = 'User added successfully';
    const duration = 2500;

    component.setMessage(message, duration, 'confirm');

    expect(component.confirmMessage).toEqual(message);

    tick(duration - 1);
    expect(component.confirmMessage).toEqual(message);

    tick(1);
    expect(component.confirmMessage).toEqual('');

    // Ensure that confirmMessage is reset after the specified duration
  }));

  it('should set errorMessage and reset after duration for error message', fakeAsync(() => {
    const message = 'Error adding user';
    const duration = 2500;

    component.setMessage(message, duration, 'error');

    expect(component.errorMessage).toEqual(message);

    tick(duration - 1);
    expect(component.errorMessage).toEqual(message);

    tick(1);
    expect(component.errorMessage).toEqual('');

    // Ensure that errorMessage is reset after the specified duration
  }));

  it('should return the correct pagination results text', () => {
    component.currentPage = 1;
    component.total = 50;
    component.resultsPerPage = 10;

    const result = component.paginationResults();

    expect(result).toEqual('1 - 10 of 50');
  });

  it('should return the correct pagination results text for the last page', () => {
    component.currentPage = 3;
    component.total = 25;
    component.resultsPerPage = 10;

    const result = component.paginationResults();

    expect(result).toEqual('21 - 25 of 25');
  });

  it('should return the correct pagination results text for a single page', () => {
    component.currentPage = 1;
    component.total = 8;
    component.resultsPerPage = 10;

    const result = component.paginationResults();

    expect(result).toEqual('1 - 8 of 8');
  });

  it('should return the correct pagination results text when total is 0', () => {
    component.currentPage = 1;
    component.total = 0;
    component.resultsPerPage = 10;

    const result = component.paginationResults();

    expect(result).toEqual('0 of 0');
  });

  it('should handle error in getUsers', fakeAsync(() => {
    const errorResponse = { error: 'Internal Server Error' };
    apiService.get.and.returnValue(throwError(() => errorResponse));

    spyOn(component, 'setMessage');
    component.getUsers();
    tick();

    expect(component.spinner).toBe(false);
    expect(component.setMessage).toHaveBeenCalledWith('Error getting users', 2500, 'error');
  }));

  it('should handle successful user deletion', fakeAsync(() => {
    const userId = 1;
    spyOn(window, 'confirm').and.returnValue(true);
    const getUsersSpy = spyOn(component, 'getUsers').and.stub();
    apiService.delete.and.returnValue(of({}));

    component.deleteUser(userId);
    tick();

    expect(apiService.delete).toHaveBeenCalledWith(`users/${userId}`);
    expect(getUsersSpy).toHaveBeenCalled();
    expect(component.setMessage).toHaveBeenCalledWith('User deleted successfully', 2500, 'confirm');
    expect(component.disabled).toBe(false);
  }));

  it('should handle error in user deletion', fakeAsync(() => {
    const userId = 1;
    spyOn(window, 'confirm').and.returnValue(true);
    const getUsersSpy = spyOn(component, 'getUsers').and.stub();
    const errorResponse = { error: 'Internal Server Error' };
    apiService.delete.and.returnValue(throwError(errorResponse));

    component.deleteUser(userId);
    tick();

    expect(apiService.delete).toHaveBeenCalledWith(`users/${userId}`);
    expect(getUsersSpy).not.toHaveBeenCalled(); // No getUsers call on error
    expect(component.setMessage).toHaveBeenCalledWith('Error deleting user', 2500, 'error');
    expect(component.disabled).toBe(false);
  }));

  it('should call ApiService.post method with correct parameters', fakeAsync(() => {
    const userData = {
      email: "name@email.com",
      gender: "male",
      id: 5852012,
      name: "name",
      status: "active"
    };

    component.addUser({} as any);
    tick();

    const expectedUrl = `users`;
    expect(apiService.post).toHaveBeenCalledWith(expectedUrl, userData);
  }));

});
