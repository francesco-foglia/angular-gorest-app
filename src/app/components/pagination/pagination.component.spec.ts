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

  it('should set currentPage on firstPage', () => {
    component.currentPage = 10;
    component.firstPage();
    expect(component.currentPage).toBe(1);
  });

  it('should emit firstPageEvent on firstPage', () => {
    component.currentPage = 10;
    spyOn(component.firstPageEvent, 'emit');
    component.firstPage();
    expect(component.firstPageEvent.emit).toHaveBeenCalledWith(1);
  });

  it('should set currentPage on lastPage', () => {
    component.currentPage = 1;
    component.pages = 100;
    component.lastPage();
    expect(component.currentPage).toBe(100);
  });

  it('should emit lastPageEvent on lastPage', () => {
    component.currentPage = 1;
    component.pages = 100;
    spyOn(component.lastPageEvent, 'emit');
    component.lastPage();
    expect(component.lastPageEvent.emit).toHaveBeenCalledWith(100);
  });

  it('should show results pagination', () => {
    component.currentPage = 1;
    component.resultsPerPage = 20;
    component.total = 40;
    expect(component.paginationResults()).toBe('1 - 20 of 40');
  });

  it('should show results pagination when currentPage is equal to pages', () => {
    component.currentPage = 2;
    component.pages = 2;
    component.resultsPerPage = 20;
    component.total = 40;
    expect(component.paginationResults()).toBe('21 - 40 of 40');
  });

  it('should emit resultsPerPageEvent with selected value when setResultsPerPage is called', () => {
    spyOn(component.resultsPerPageEvent, 'emit');
    const event = {
      target: {
        innerHTML: '5',
      },
    };
    component.setResultsPerPage(event);
    expect(component.resultsPerPage).toEqual(5);
    expect(component.resultsPerPageEvent.emit).toHaveBeenCalledWith(5);
  });

  it('should not emit resultsPerPageEvent if event target innerHTML is not a number', () => {
    spyOn(component.resultsPerPageEvent, 'emit');
    const event = {
      target: {
        innerHTML: 'abc',
      },
    };
    component.setResultsPerPage(event);
    expect(component.resultsPerPageEvent.emit).not.toHaveBeenCalled();
  });

});
