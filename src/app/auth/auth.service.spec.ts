import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set isLoggedIn to true when sessionStorage has "isLoggedIn" as "true"', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('true');
    service = new AuthService();
    expect(service.isLoggedIn).toBe(true);
  });

  it('should set isLoggedIn to false when sessionStorage has "isLoggedIn" as any value other than "true"', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('false');
    service = new AuthService();
    expect(service.isLoggedIn).toBe(false);
  });

});
