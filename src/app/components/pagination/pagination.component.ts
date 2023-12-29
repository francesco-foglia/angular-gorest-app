import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() elements: any[] = [];
  @Input() spinner: boolean = false;
  @Input() currentPage: number = 0;
  @Input() pages: number = 0;
  @Input() resultsPerPage: number = 0;
  @Input() total: number = 0;

  @Output() previousPageEvent = new EventEmitter<number>();
  @Output() nextPageEvent = new EventEmitter<number>();
  @Output() firstPageEvent = new EventEmitter<number>();
  @Output() lastPageEvent = new EventEmitter<number>();
  @Output() resultsPerPageEvent = new EventEmitter<number>();

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    this.previousPageEvent.emit(this.currentPage);
  }

  nextPage() {
    if (this.currentPage !== this.pages) {
      this.currentPage++;
    }
    this.nextPageEvent.emit(this.currentPage);
  }

  firstPage() {
    this.currentPage = 1;
    this.firstPageEvent.emit(this.currentPage);
  }

  lastPage() {
    this.currentPage = this.pages;
    this.lastPageEvent.emit(this.currentPage);
  }

  setResultsPerPage(event: any) {
    if (!isNaN(parseInt(event.target.innerHTML))) {
      const selectedValue = parseInt(event.target.innerHTML);
      this.resultsPerPage = selectedValue;
      this.resultsPerPageEvent.emit(this.resultsPerPage);
    }
  }

  paginationResults() {
    const results = `${this.currentPage === 1 ? 1 : (this.currentPage - 1) * this.resultsPerPage + 1} - ${this.currentPage !== this.pages ? this.currentPage * this.resultsPerPage : this.total} of ${this.total}`;
    return results;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
