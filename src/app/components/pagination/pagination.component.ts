import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() elements: any[] = [];
  @Input() spinner: boolean = false;
  @Input() currentPage: number = 1;
  @Input() pages: number = 1;
  @Input() resultsPerPage: number = 20;
  @Input() paginationResults: string = '';

  @Output() previousPageEvent = new EventEmitter<number>();
  @Output() nextPageEvent = new EventEmitter<number>();

  previousPage() {
    this.previousPageEvent.emit(this.currentPage);
  }

  nextPage() {
    this.nextPageEvent.emit(this.currentPage);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
