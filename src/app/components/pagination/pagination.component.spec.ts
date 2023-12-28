import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increment currentPage on nextPage', () => {
    component.currentPage = 1;
    component.pages = 10;
    component.nextPage();
    expect(component.currentPage).toBe(2);
  });

  it('should emit nextPageEvent on nextPage', () => {
    component.currentPage = 1;
    component.pages = 10;
    spyOn(component.nextPageEvent, 'emit');
    component.nextPage();
    expect(component.nextPageEvent.emit).toHaveBeenCalledWith(2);
  });

  it('should decrement currentPage on previousPage', () => {
    component.currentPage = 2;
    component.previousPage();
    expect(component.currentPage).toBe(1);
  });

  it('should emit previousPageEvent on previousPage', () => {
    component.currentPage = 2;
    spyOn(component.previousPageEvent, 'emit');
    component.previousPage();
    expect(component.previousPageEvent.emit).toHaveBeenCalledWith(1);
  });

  it('should show results pagination', () => {
    component.currentPage = 1;
    component.resultsPerPage = 20;
    component.total = 40;
    expect(component.paginationResults()).toBe('1 - 20 of 40');
  });

});
