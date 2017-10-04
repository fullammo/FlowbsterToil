import { JointService } from 'app/editor/shared/joint.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MdSort, MdPaginator } from '@angular/material';
import { FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { WorkflowEntry } from 'app/view-models/workflowEntry';
import { WorkflowEntryService } from 'app/services/workflow-entry.service';
import { WorkflowDataSource } from 'app/workflow-maint/workflowDataSource';
import { OccoService } from 'app/services/occo.service';
import { DescriptorService } from 'app/editor/shared/descriptor.service';

/**
 * Component to visualize database entries and make various operations with them.
 */
@Component({
  selector: 'toil-workflow-maint',
  templateUrl: './workflow-maint.component.html',
  styleUrls: ['./workflow-maint.component.scss']
})
export class WorkflowMaintComponent implements OnInit {

  /**
   * the displayed Columns in the data grid.
   */
  displayedColumns = ['select', 'name', 'description', 'edit'];

  /**
   * Properly formatted Workflow information to the data grid.
   */
  dataSource: WorkflowDataSource | null;

  /**
   * Keeps information about which checkbox is getting selected.
   */
  selection = new SelectionModel<string>(true, []);

  /**
   * 3rd party paginator component for the data grid.
   */
  @ViewChild(MdPaginator) paginator: MdPaginator;

  /**
   * 3rd party sorter component for the data grid columns.
   */
  @ViewChild(MdSort) sort: MdSort;

  /**
   * Element reference for filtering functionality.
   */
  @ViewChild('filter') filter: ElementRef;

  /**
   * Injects the needed services.
   */
  constructor(private workflowEntrySVC: WorkflowEntryService,
    private router: Router,
    private occoSVC: OccoService,
    private jointSVC: JointService) {
  }

  /**
   * Initializes the data grids datasource with paginated and sortable database entries
   * and subscribes to the filtering elements keyup event.
   */
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

  /**
   * Decides if every element of the data grid is selected
   * @returns An indicator about all of the checkboxes state.
   */
  isAllSelected(): boolean {
    if (!this.dataSource) { return false; }
    if (this.selection.isEmpty()) { return false; }

    if (this.filter.nativeElement.value) {
      return this.selection.selected.length === this.dataSource.renderedEntries.length;
    } else {
      return this.selection.selected.length === this.workflowEntrySVC.data.length;
    }
  }

  /**
   * Checks if its actually in the database and then shows its graph on the paper.
   * @param id Unique identifier of the data entry in the database.
   */
  onEntryClick(id: string) {
    const entryy = this.workflowEntrySVC.data.find(entry => {
      return entry.$key === id;
    });

    if (entryy) {
      this.jointSVC.uploadGraph(JSON.parse(entryy.graph));
    }
  }

  /**
   * Checks every checkboxes.
   */
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

  /**
   * Gets the selected workflow's entry and calls the Occopus service with its descriptor.
   */
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

  /**
   * Idk.
   */
  destroyWorkflow(): void {

  }

  /**
   *Idk.
   */
  startProcessing(): void {

  }

  /**
   *Idk.
   */
  stopProcessing(): void {

  }

  /**
   * Gets the selected entries and creates a clone of them to the database.
   */
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

  /**
   * Navigates by given key to that Workflow's edit page.
   * @param key Unique Identifier of the Entry in the database.
   */
  editEntry(key: string): void {
    this.router.navigate(['/authenticated/workflow-detail', key, 'edit']);
  }

  /**
   * Deletes every selected workflow from the database.
   */
  deleteWorkflow(): void {
    this.selection.selected.forEach(key => this.workflowEntrySVC.deleteEntry(key));
    this.selection.clear();
  }

  /**
   * Navigates to the workflow creation page.
   */
  createEntry(): void {
    this.router.navigate(['/authenticated/workflow-detail', 0, 'create']);
  }
}


