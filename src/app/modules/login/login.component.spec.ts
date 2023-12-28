import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../auth/auth.service';
import { ApiService } from '../../services/api.service';
import { HttpResponse } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    apiService = jasmine.createSpyObj('ApiService', ['get']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
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
    authService.isLoggedIn = false;
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should call onSubmit() when Enter key is pressed', fakeAsync(() => {
    spyOn(component, 'onSubmit');
    const event = new KeyboardEvent('keyup', { key: 'Enter' });
    component.onKeyUp(event);
    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should not call onSubmit() for other keys', fakeAsync(() => {
    spyOn(component, 'onSubmit');
    const event = new KeyboardEvent('keyup', { key: 'A' });
    component.onKeyUp(event);
    expect(component.onSubmit).not.toHaveBeenCalled();
  }));

  it('should set "Fill in the Token field" error message when form is invalid', () => {
    component.loginForm.setValue({ token: '' });
    component.onSubmit();
    expect(component.errorMessage).toBe('Fill in the Token field');
  });

  it('should set "An error occurred while logging in" error message on API error', fakeAsync(() => {
    const testToken = 'testToken';
    const errorResponse = { status: 500 };
    authService.isLoggedIn = false;
    apiService.get.and.returnValue(throwError(() => errorResponse));
    component.loginForm.setValue({ token: testToken });
    component.onSubmit();
    tick();
    fixture.detectChanges();
    expect(component.errorMessage).toBe('An error occurred while logging in');
  }));

  it('should clear errorMessage on input', () => {
    component.errorMessage = 'Some error message';
    component.onInput();
    expect(component.errorMessage).toBe('');
  });

  it('should set error message on 401 status', () => {
    const errorResponse = { status: 401 };
    apiService.get.and.returnValue(throwError(() => errorResponse));
    spyOn(sessionStorage, 'removeItem');
    component.login();
    expect(component.errorMessage).toBe('Invalid token. Log in again');
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should set spinner to false on complete', fakeAsync(() => {
    spyOn(component, 'login').and.callThrough();
    spyOn(sessionStorage, 'removeItem');
    const httpResponse: HttpResponse<any> = new HttpResponse({ status: 200, body: {} });
    apiService.get.and.returnValue(of(httpResponse));
    component.login();
    tick();
    expect(component.spinner).toBe(false);
  }));

});
