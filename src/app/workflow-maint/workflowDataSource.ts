import { WorkflowEntry } from 'app/view-models/workflowEntry';
import { Observable } from 'rxjs/Observable';
import { WorkflowEntryService } from 'app/services/workflow-entry.service';
import { DataSource } from '@angular/cdk/collections';
import { MdSort, MdPaginator } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * Own type of data source that can be accepted in the data grid.
 * Represents a filterable and sortable data collection for the grid.
 */
export class WorkflowDataSource extends DataSource<any> {

  /**
   * An observable for watching any changes made to the filtering element.
   */
  filterChange = new BehaviorSubject('');

  /**
   * Gets the observable's actual value.
   */
  get filter(): string { return this.filterChange.value; }

  /**
   * Emits information about the next filter expression.
   */
  set filter(filter: string) { this.filterChange.next(filter); }

  /**
   * A collection of actually filtered entries.
   */
  filteredEntries: WorkflowEntry[] = [];

  /**
   * A collection of present entries in the datagrid.
   */
  renderedEntries: WorkflowEntry[] = [];

  /**
   * We inject the needed services and whenever the filter changes the paginator page will be initial.
   * @param paginator Paginator component for customization.
   * @param sort Sorting component for customization.
   */
  constructor(private workflowEntrySVC: WorkflowEntryService, private paginator: MdPaginator, private sort: MdSort) {
    super();
    this.filterChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  /**
   * Whenever any changes made to the displayed data its going to rerender it.
   */
  connect(): Observable<WorkflowEntry[]> {
    const displayDataChanges = [
      this.workflowEntrySVC.dataChange,
      this.sort._matSortChange,
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

  /**
   *Idk.
   */
  disconnect() { }

  /**
   * Sorts the database entries by the given operation.
   * @param entries A collection of sortable entries.
   * @returns A collection of sorted database entries.
   */
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
