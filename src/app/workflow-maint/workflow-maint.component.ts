import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { MdSort } from '@angular/material';
import { FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { WorkflowEntry } from 'app/view-models/workflowEntry';
import { WorkflowEntryService } from 'app/services/workflow-entry.service';

@Component({
  selector: 'toil-workflow-maint',
  templateUrl: './workflow-maint.component.html',
  styleUrls: ['./workflow-maint.component.scss']
})
export class WorkflowMaintComponent implements OnInit {

  displayedColumns = ['name', 'description', 'descriptor', 'graph'];
  dataSource: WorkflowDataSource;

  @ViewChild(MdSort) sort: MdSort;

  constructor(public workflowEntrySVC: WorkflowEntryService, private router: Router) {
  }

  ngOnInit() {
    this.dataSource = new WorkflowDataSource(this.workflowEntrySVC, this.sort);
  }

  createEntry() {
    this.router.navigate(['/authenticated/workflow-detail', 0, 'create']);
  }

}

export class WorkflowDataSource extends DataSource<any> {

  constructor(private workflowEntrySVC: WorkflowEntryService, private sort: MdSort) {
    super();
  }

  connect(): Observable<WorkflowEntry[]> {
    const displayDataChanges = [
      this.workflowEntrySVC.dataChange,
      this.sort.mdSortChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData();
    });
  }

  disconnect() { }

  getSortedData(): WorkflowEntry[] {
    const data = this.workflowEntrySVC.dataChange.value;

    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
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
