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

  it('should initialize isLoggedIn to false if not set in sessionStorage', () => {
    expect(authService.isLoggedIn).toBe(false);
  });

  it('should initialize isLoggedIn to true if set to true in sessionStorage', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('true');
    authService = TestBed.inject(AuthService);
    expect(authService.isLoggedIn).toBe(true);
  });

  it('should initialize isLoggedIn to false if set to false in sessionStorage', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('false');
    authService = TestBed.inject(AuthService);
    expect(authService.isLoggedIn).toBe(false);
  });

  it('should initialize isLoggedIn to false if sessionStorage returns an invalid value', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('invalid');
    authService = TestBed.inject(AuthService);
    expect(authService.isLoggedIn).toBe(false);
  });
});
