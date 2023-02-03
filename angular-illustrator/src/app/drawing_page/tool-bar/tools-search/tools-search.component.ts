import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Tools } from '../../tools.enum';

@Component({
  selector: 'app-tools-search',
  templateUrl: './tools-search.component.html',
  styleUrls: ['./tools-search.component.scss']
})
export class ToolsSearchComponent {
  control = new FormControl();
  options = Object.values(Tools);

  filteredOptions: Observable<string[]> = of([]);
  @Output() updateFilter = new EventEmitter<string[]>();

  ngOnInit() {
    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.filteredOptions.subscribe(options => {
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    const res = this.options.filter(option => option.toLowerCase().includes(filterValue));
    this.updateFilter.emit(res);
    return res;
  }
}
