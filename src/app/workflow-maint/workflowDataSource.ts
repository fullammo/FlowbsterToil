import { WorkflowEntry } from 'app/view-models/workflowEntry';
import { Observable } from 'rxjs/Observable';
import { WorkflowEntryService } from 'app/services/workflow-entry.service';
import { DataSource } from '@angular/cdk/collections';
import { MdSort, MdPaginator } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class WorkflowDataSource extends DataSource<any> {

  filterChange = new BehaviorSubject('');
  get filter(): string { return this.filterChange.value; }
  set filter(filter: string) { this.filterChange.next(filter); }

  filteredEntries: WorkflowEntry[] = [];
  renderedEntries: WorkflowEntry[] = [];

  constructor(private workflowEntrySVC: WorkflowEntryService, private paginator: MdPaginator, private sort: MdSort) {
    super();
    this.filterChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  connect(): Observable<WorkflowEntry[]> {
    const displayDataChanges = [
      this.workflowEntrySVC.dataChange,
      this.sort.mdSortChange,
      this.filterChange,
      this.paginator.page
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      // filter data
      this.filteredEntries = this.workflowEntrySVC.data.slice().filter((entry: WorkflowEntry) => {
        const searchStr = (entry.name + entry.description).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });

      // Sort filtered data
      const sortedData = this.getSortedEntries(this.filteredEntries.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      this.renderedEntries = sortedData.splice(startIndex, this.paginator.pageSize);

      return this.renderedEntries;
    });
  }

  disconnect() { }

  getSortedEntries(entries: WorkflowEntry[]): WorkflowEntry[] {

    if (!this.sort.active || this.sort.direction === '') {
      return entries;
    }

    return entries.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this.sort.active) {
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
