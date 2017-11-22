import { Component, OnInit } from '@angular/core';
import { WorkflowEntryService } from 'app/workflow/shared/workflow-entry.service';
import { WorkflowEntry } from 'app/workflow/shared/workflowEntry';

@Component({
  selector: 'toil-workflow-manager',
  templateUrl: './workflow-manager.component.html',
  styleUrls: ['./workflow-manager.component.scss']
})
export class WorkflowManagerComponent implements OnInit {
  workflowEntries: WorkflowEntry[];
  cols: any[];

  constructor(private workflowEntrySVC: WorkflowEntryService) {}

  ngOnInit() {
    this.workflowEntrySVC.dataChange.subscribe(entries => {
      this.workflowEntries = entries;
    });
  }

  editEntry(key: string) {
    console.log(key);
  }
}
