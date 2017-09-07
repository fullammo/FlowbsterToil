import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FirebaseListObservable } from 'angularfire2/database';
import { WorkflowEntry } from 'app/view-models/workflowEntry';
import { WorkflowEntryService } from 'app/services/workflow-entry.service';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'toil-workflow-maint',
  templateUrl: './workflow-maint.component.html',
  styleUrls: ['./workflow-maint.component.scss']
})
export class WorkflowMaintComponent implements OnInit {

  workflowEntries: WorkflowEntry[];
  displayedColumns = ['description', 'name', 'descriptor', 'graph'];
  dataSource: WorkflowDataSource;

  constructor(private workflowEntrySVC: WorkflowEntryService, private router: Router) {
    workflowEntrySVC.getWorkflowEntries().subscribe((data) => this.workflowEntries = data);

  }

  ngOnInit() {
    this.dataSource = new WorkflowDataSource(this.workflowEntrySVC);
  }

  createEntry() {
    this.router.navigate(['/authenticated/workflow-detail', 0, 'create']);
  }

}

export class WorkflowDataSource extends DataSource<any> {

  constructor(private workflowEntrySVC: WorkflowEntryService) {
    super();
  }

  connect(): Observable<WorkflowEntry[]> {
    return this.workflowEntrySVC.getWorkflowEntries();
  }

  disconnect() { }
}
