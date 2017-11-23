import { Component, OnInit } from '@angular/core';
import { WorkflowEntryService } from 'app/workflow/shared/workflow-entry.service';
import { WorkflowEntry } from 'app/workflow/shared/workflowEntry';
import { MenuItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { OccoService } from 'app/workflow/shared/occo.service';
import { WorkflowDetailComponent } from 'app/workflow/workflow-detail/workflow-detail.component';

@Component({
  selector: 'toil-workflow-manager',
  templateUrl: './workflow-manager.component.html',
  styleUrls: ['./workflow-manager.component.scss']
})
export class WorkflowManagerComponent implements OnInit {
  workflowEntries: WorkflowEntry[];
  selectedWorkflowEntries: WorkflowEntry[];
  cols: any[];
  items: MenuItem[];

  constructor(
    private workflowEntrySVC: WorkflowEntryService,
    private router: Router,
    private occoSVC: OccoService
  ) {}

  /**
   * We subscibe to any changes made to the Entry FireStore collection.
   */
  ngOnInit() {
    this.workflowEntrySVC.dataChange.subscribe(entries => {
      this.workflowEntries = entries;
    });

    this.items = [
      {
        label: 'View',
        icon: 'fa-search',
        command: event => this.eviii()
      },
      {
        label: 'Delete',
        icon: 'fa-close', // fa-trash-o
        command: event => this.eviii()
      }
    ];
  }

  /**
   * TODO Should be Modified to do not disturb visually.
   */
  onAddClick() {
    this.workflowEntrySVC
      .saveEntry(this.workflowEntrySVC.initEntry())
      .then(doc => {
        console.log(doc.id);
        this.router.navigate([
          '/authenticated/workflow-detail',
          doc.id,
          'create'
        ]);
      });
  }

  /**
   * If there is any entry selected it gets saved under a new id into the fireStore database.
   */
  onMultiCopyClick() {
    this.IfAnyItemIsSelected(entry => {
      this.copyEntry(entry);
    });
  }

  /**
   * If there is any entry selected it gets removed from the fireStore database and also from the selection.
   */
  onMultiDeleteClick() {
    const toBeDeletedFromSelection: WorkflowEntry[] = [];

    this.IfAnyItemIsSelected(entry => {
      this.deleteEntry(entry.$key);
      toBeDeletedFromSelection.push(entry);
    });

    this.cleanSelection(toBeDeletedFromSelection);
  }
  /**
   * If there is any entry selected its infrastructure data gets sent via Http to Occopus.
   */
  onMultiBuildClick() {
    this.IfAnyItemIsSelected(entry => {
      // this.occoSVC.buildWorkflow(entry.descriptor, entry.$key);
      console.log(entry);
    });
  }

  /**
   * Checks if there is any workflow selected and gets any job done for each individual item.
   * @param atomicJob
   */
  private IfAnyItemIsSelected(atomicJob: (entry: WorkflowEntry) => any) {
    if (this.selectedWorkflowEntries.length !== 0) {
      this.selectedWorkflowEntries.forEach(entry => {
        atomicJob(entry);
      });
    } else {
      console.log('No Item is selected in the Data Table');
    }
  }

  /**
   * Deletes the given array of items from the selection.
   * @param toBeDeletedFromSelection
   */
  private cleanSelection(toBeDeletedFromSelection: WorkflowEntry[]) {
    toBeDeletedFromSelection.forEach(deletedEntry => {
      this.removeByWorkflowEntryKey(this.selectedWorkflowEntries, deletedEntry);
    });
  }

  /**
   * Removes the Workflow Entry by its key from the given Workflow Entries.
   * @param array
   * @param entry
   */
  private removeByWorkflowEntryKey(
    array: WorkflowEntry[],
    entry: WorkflowEntry
  ) {
    if (entry.$key !== undefined) {
      array.some((item, index) => {
        return array[index].$key === entry.$key
          ? !!array.splice(index, 1)
          : false;
      });
    }
  }

  eviii() {
    console.log('eviiii');
  }

  /**
   * Navigates by given key to that Workflow's edit page.
   * @param key Unique Identifier of the Entry in the database.
   */
  navigateToEditPage(key: string) {
    this.router.navigate(['/authenticated/workflow-detail', key, 'edit']);
  }

  /**
   * Cleans the selection with the actual element if it was selected, then deletes the entry.
   * @param entry
   */
  onDeleteClicked(entry: WorkflowEntry) {
    this.cleanSelection([entry]);
    this.deleteEntry(entry.$key);
  }

  /**
   * Copies the actual entry to the database.
   */
  onCopyClicked(entry: WorkflowEntry) {
    this.copyEntry(entry);
  }

  /**
   * Navigates to the Edit Page.
   * @param entry
   */
  onEditClicked(entry: WorkflowEntry) {
    this.navigateToEditPage(entry.$key);
  }

  /**
   * Deletes an individual record from the fireStore Database.
   * @param key
   */
  deleteEntry(key: string) {
    this.workflowEntrySVC.deleteEntry(key);
  }

  /**
   * It peels the entry from the ID property and saves it to the FireStore database.
   * @param entry
   */
  copyEntry(entry: WorkflowEntry) {
    const peeledEntry = this.workflowEntrySVC.peelEntry(entry);
    this.workflowEntrySVC.saveEntry(peeledEntry);
  }
}
