import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should initialize isLoggedIn to true if sessionStorage returns "true"', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('true');
    authService = TestBed.inject(AuthService);
    expect(authService.isLoggedIn).toBe(true);
  });

  it('should initialize isLoggedIn to false if sessionStorage returns "false"', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('false');
    authService = TestBed.inject(AuthService);
    expect(authService.isLoggedIn).toBe(false);
  });

  it('should initialize isLoggedIn to false if sessionStorage returns an invalid value', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('invalid');
    authService = TestBed.inject(AuthService);
    expect(authService.isLoggedIn).toBe(false);
  });

  it('should initialize isLoggedIn to false if sessionStorage returns null', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null);
    authService = TestBed.inject(AuthService);
    expect(authService.isLoggedIn).toBe(false);
  });
});
