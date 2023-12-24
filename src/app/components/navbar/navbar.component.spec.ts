import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NavbarComponent],
      providers: [AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout', fakeAsync(() => {
    const navigateSpy = spyOn(router, 'navigate');
    component.logout();

    // Ensure that the spinner is set to true
    expect(component.spinner).toBe(true);

    // Advance time by 500 milliseconds
    tick(500);

    // Ensure that the AuthService isLoggedIn is set to false
    expect(authService.isLoggedIn).toBe(false);

    // Ensure that sessionStorage is cleared
    expect(sessionStorage.getItem('isLoggedIn')).toBe(null);
    expect(sessionStorage.getItem('token')).toBe(null);

    // Ensure that the router navigate is called with the correct parameter
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);

    // Ensure that the spinner is set back to false
    expect(component.spinner).toBe(false);
  }));
});
