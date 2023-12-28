import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersComponent } from './users.component';
import { ApiService } from '../../services/api.service';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['get']);
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

});
