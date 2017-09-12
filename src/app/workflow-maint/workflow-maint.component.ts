import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { MdSort, MdPaginator, SelectionModel } from '@angular/material';
import { FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { WorkflowEntry } from 'app/view-models/workflowEntry';
import { WorkflowEntryService } from 'app/services/workflow-entry.service';
import { WorkflowDataSource } from 'app/workflow-maint/workflowDataSource';

@Component({
  selector: 'toil-workflow-maint',
  templateUrl: './workflow-maint.component.html',
  styleUrls: ['./workflow-maint.component.scss']
})
export class WorkflowMaintComponent implements OnInit {

  displayedColumns = ['select', 'name', 'description', 'descriptor', 'graph', 'edit'];
  dataSource: WorkflowDataSource | null;
  selection = new SelectionModel<string>(true, []);

  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild('filter') filter: ElementRef;

  constructor(public workflowEntrySVC: WorkflowEntryService, private router: Router) {
  }

  ngOnInit() {
    this.dataSource = new WorkflowDataSource(this.workflowEntrySVC, this.paginator, this.sort);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  isAllSelected(): boolean {
    if (!this.dataSource) { return false; }
    if (this.selection.isEmpty()) { return false; }

    if (this.filter.nativeElement.value) {
      return this.selection.selected.length === this.dataSource.renderedEntries.length;
    } else {
      return this.selection.selected.length === this.workflowEntrySVC.data.length;
    }
  }

  masterToggle() {
    if (!this.dataSource) { return; }

    if (this.isAllSelected()) {
      this.selection.clear();
    } else if (this.filter.nativeElement.value) {
      this.dataSource.renderedEntries.forEach(data => this.selection.select(data.$key));
    } else {
      this.workflowEntrySVC.data.forEach(data => this.selection.select(data.$key));
    }
  }

  buildInfrastructure(): void {

  }

  destroyInfrastructure(): void {

  }

  startWorfklow(): void {

  }

  stopWorkflow(): void {

  }

  editEntry(key: string): void {
    console.log(key);
  }

  deleteWorkflow(): void {
    this.selection.selected.forEach(key => this.workflowEntrySVC.deleteEntry(key));
    this.selection.clear();
  }

  createEntry(): void {
    this.router.navigate(['/authenticated/workflow-detail', 0, 'create']);
  }
}


