import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Input() label: string = '';
  @Input() searchValue: string = '';
  @Output() searchEvent = new EventEmitter<string>();

  onSearch() {
    this.searchEvent.emit(this.searchValue.trim());
  }

  onClear() {
    this.searchValue = '';
    this.searchEvent.emit(this.searchValue);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
