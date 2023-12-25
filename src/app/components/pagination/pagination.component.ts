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

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    this.previousPageEvent.emit(this.currentPage);
  }

  nextPage() {
    if (this.elements.length === this.resultsPerPage) {
      this.currentPage++;
    }
    this.nextPageEvent.emit(this.currentPage);
  }

  paginationResults() {
    const results = `
      ${this.currentPage === 1 ? 1 : (this.currentPage - 1) * this.resultsPerPage + 1} -
      ${this.currentPage !== this.pages ? this.currentPage * this.resultsPerPage : this.total} of ${this.total}
    `;
    return results;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
