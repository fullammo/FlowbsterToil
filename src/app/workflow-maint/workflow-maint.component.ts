import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MdSort, MdPaginator} from '@angular/material';
import { FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { WorkflowEntry } from 'app/view-models/workflowEntry';
import { WorkflowEntryService } from 'app/services/workflow-entry.service';
import { WorkflowDataSource } from 'app/workflow-maint/workflowDataSource';
import { OccoService } from 'app/services/occo.service';
import { DescriptorService } from 'app/editor/shared/descriptor.service';

@Component({
  selector: 'toil-workflow-maint',
  templateUrl: './workflow-maint.component.html',
  styleUrls: ['./workflow-maint.component.scss']
})
export class WorkflowMaintComponent implements OnInit {

  // displayedColumns = ['select', 'name', 'description', 'descriptor', 'graph', 'edit'];
  displayedColumns = ['select', 'name', 'description', 'edit'];
  dataSource: WorkflowDataSource | null;
  selection = new SelectionModel<string>(true, []);

  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild('filter') filter: ElementRef;

  constructor(public workflowEntrySVC: WorkflowEntryService,
    private router: Router, private occoSVC: OccoService) {
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

  buildWorkflow(): void {
    const entryy = this.workflowEntrySVC.data.find(entry => {
      const selected = this.selection.selected.find(key => {
        return key === entry.$key;
      });
      return selected !== undefined;
    });
    console.log(entryy);
    this.occoSVC.buildWorkflow(entryy.descriptor);
  }

  destroyWorkflow(): void {

  }

  startProcessing(): void {

  }

  stopProcessing(): void {

  }

  copyEntries(): void {
    const copyEntries = this.workflowEntrySVC.data.filter(entry => {
      const selected = this.selection.selected.find(key => {
        return key === entry.$key;
      });
      return selected !== undefined;
    });

    if (copyEntries.length !== 0) {
      copyEntries.forEach(entry => {
        const cleanedEntry = this.workflowEntrySVC.cloneEntry(entry);
        this.workflowEntrySVC.saveEntry(cleanedEntry);
      });
    } else {
      console.log('No entries specified'); // could put up a toast message.
    }
  }

  editEntry(key: string): void {
    this.router.navigate(['/authenticated/workflow-detail', key, 'edit']);
  }

  deleteWorkflow(): void {
    this.selection.selected.forEach(key => this.workflowEntrySVC.deleteEntry(key));
    this.selection.clear();
  }

  createEntry(): void {
    this.router.navigate(['/authenticated/workflow-detail', 0, 'create']);
  }
}


