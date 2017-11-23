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
   * If there is any entry selected it gets saved under a new id into the fireStore
   */
  onMultiCopyClick() {
    this.IfAnyItemIsSelected(entry => {
      const peeledEntry = this.workflowEntrySVC.peelEntry(entry);
      this.workflowEntrySVC.saveEntry(peeledEntry);
    });
  }

  /**
   * If there is any entry selected it gets removed from the fireStore database and also from the selection.
   */
  onMultiDeleteClick() {
    const toBeDeletedFromSelection: WorkflowEntry[] = [];

    this.IfAnyItemIsSelected(entry => {
      this.workflowEntrySVC.deleteEntry(entry.$key);
      toBeDeletedFromSelection.push(entry);
    });

    toBeDeletedFromSelection.forEach(deletedEntry => {
      this.removeByWorkflowEntryKey(this.selectedWorkflowEntries, deletedEntry);
    });
  }

  /**
   * If there is any entry selected its infrastructure data gets sent via Http to Occopus.
   */
  onMultiBuildClick() {
    this.IfAnyItemIsSelected(entry => {
      this.occoSVC.buildWorkflow(entry.descriptor, entry.$key);
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

  editEntry(key: string) {
    console.log(key);
  }
}
