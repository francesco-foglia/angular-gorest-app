import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../auth/auth.service';

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
    expect(component.spinner).toBe(true);
    tick(500);
    expect(authService.isLoggedIn).toBe(false);
    expect(sessionStorage.getItem('isLoggedIn')).toBe(null);
    expect(sessionStorage.getItem('token')).toBe(null);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    expect(component.spinner).toBe(false);
  }));

});
