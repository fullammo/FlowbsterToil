import { Component, OnInit } from '@angular/core';
import { WorkflowEntryService } from 'app/workflow/shared/workflow-entry.service';
import { WorkflowEntry } from 'app/workflow/shared/workflowEntry';
import { MenuItem } from 'primeng/primeng';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

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

  eviii() {
    console.log('eviiii');
  }

  editEntry(key: string) {
    console.log(key);
  }
}
