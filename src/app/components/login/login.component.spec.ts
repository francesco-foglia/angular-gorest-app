import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    router = jasmine.createSpyObj('Router', ['navigate']); // Create a spy on the Router
    apiService = jasmine.createSpyObj('ApiService', ['get']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }, // Provide the spy Router
        FormBuilder,
        { provide: ApiService, useValue: apiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /login if user is not logged in', () => {
    // Mock isLoggedIn to return false
    authService.isLoggedIn = false;

    // Trigger ngOnInit
    component.ngOnInit();

    // Expect the router.navigate to have been called with ['/login']
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should call login() on form submission', fakeAsync(() => {
    const testToken = 'testToken';
    const apiResponse = { /* your mock API response here */ };

    // Mock isLoggedIn to return false
    // authService.isLoggedIn.and.returnValue(false);
    authService.isLoggedIn = false;

    // Mock API service to return observable of the mock response
    apiService.get.and.returnValue(of(new HttpResponse({ body: apiResponse })));

    // Set token in the form
    component.loginForm.setValue({ token: testToken });

    // Call onSubmit, which should call login()
    component.onSubmit();

    // Expectations
    expect(component.spinner).toBe(true);
    expect(sessionStorage.getItem('token')).toBe(testToken);

    // Simulate API response
    tick();
    fixture.detectChanges();

    // Expectations after API response
    expect(sessionStorage.getItem('isLoggedIn')).toBe('true');
    expect(authService.isLoggedIn).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
    expect(component.spinner).toBe(false);
  }));

  it('should handle error when login fails', fakeAsync(() => {
    const testToken = 'testToken';
    const errorResponse = { status: 401 };

    // Mock isLoggedIn to return false
    authService.isLoggedIn = false;

    // Mock API service to return an error observable
    // apiService.get.and.returnValue(throwError(errorResponse));
    apiService.get.and.returnValue(throwError(() => errorResponse));

    // Set token in the form
    component.loginForm.setValue({ token: testToken });

    // Call onSubmit, which should call login()
    component.onSubmit();

    // Expectations
    expect(component.spinner).toBe(true);
    expect(sessionStorage.getItem('token')).toBe(testToken);

    // Simulate API error response
    tick();
    fixture.detectChanges();

    // Expectations after API error response
    expect(component.errorMessage).toBe('Invalid token. Log in again');
    expect(sessionStorage.getItem('token')).toBe(null);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.spinner).toBe(false);
  }));

  it('should clear errorMessage on input', () => {
    // Set an initial error message
    component.errorMessage = 'Some error message';

    // Call onInput
    component.onInput();

    // Expectations
    expect(component.errorMessage).toBe('');
  });

  it('should call onSubmit() when Enter key is pressed', fakeAsync(() => {
    // Create a spy on the onSubmit method
    spyOn(component, 'onSubmit');

    // Simulate the Enter key press
    const event = new KeyboardEvent('keyup', { key: 'Enter' });
    component.onKeyUp(event);

    // Expect onSubmit to be called
    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should not call onSubmit() for other keys', fakeAsync(() => {
    // Create a spy on the onSubmit method
    spyOn(component, 'onSubmit');

    // Simulate a key press other than Enter
    const event = new KeyboardEvent('keyup', { key: 'A' });
    component.onKeyUp(event);

    // Expect onSubmit not to be called
    expect(component.onSubmit).not.toHaveBeenCalled();
  }));

  it('should set "Fill in the Token field" error message when form is invalid', () => {
    // Set the form to be invalid
    component.loginForm.setValue({ token: '' });

    // Trigger onSubmit
    component.onSubmit();

    // Expect the errorMessage to be 'Fill in the Token field'
    expect(component.errorMessage).toBe('Fill in the Token field');
  });

  it('should set "An error occurred while logging in" error message on API error', fakeAsync(() => {
    const testToken = 'testToken';
    const errorResponse = { status: 500 };

    // Mock isLoggedIn to return false
    authService.isLoggedIn = false;

    // Mock API service to return an error observable
    apiService.get.and.returnValue(throwError(() => errorResponse));

    // Set token in the form
    component.loginForm.setValue({ token: testToken });

    // Call onSubmit, which should call login()
    component.onSubmit();

    // Simulate API error response
    tick();
    fixture.detectChanges();

    // Expect the errorMessage to be 'An error occurred while logging in'
    expect(component.errorMessage).toBe('An error occurred while logging in');
  }));

});
