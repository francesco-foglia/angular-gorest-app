import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search event on onSearch()', () => {
    spyOn(component.searchEvent, 'emit');
    component.searchValue = 'test';
    component.onSearch();
    expect(component.searchEvent.emit).toHaveBeenCalledWith('test');
  });

  it('should clear search value and emit search event on onClear()', () => {
    spyOn(component.searchEvent, 'emit');
    component.searchValue = 'test';
    component.onClear();
    expect(component.searchValue).toEqual('');
    expect(component.searchEvent.emit).toHaveBeenCalledWith('');
  });

  it('should initialize component properties in ngOnInit()', () => {
    component.label = 'Test Label';
    component.searchValue = 'Initial Search Value';
    component.ngOnInit();
    expect(component.label).toEqual('Test Label');
    expect(component.searchValue).toEqual('Initial Search Value');
  });
});
