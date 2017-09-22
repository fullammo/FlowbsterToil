import { WorkflowEntry } from 'app/view-models/workflowEntry';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { JointService } from 'app/editor/shared/joint.service';
import { DescriptorService } from 'app/editor/shared/descriptor.service';
import { WorkflowEntryService } from 'app/services/workflow-entry.service';

@Component({
  selector: 'toil-workflow-detail',
  templateUrl: './workflow-detail.component.html',
  styleUrls: ['./workflow-detail.component.scss']
})
export class WorkflowDetailComponent implements OnInit, AfterViewInit {

  operation: string;
  isGraphValid = false;
  entry: WorkflowEntry;
  userform: FormGroup;

  constructor(private jointSVC: JointService,
    private descriptorSVC: DescriptorService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private workflowEntrySVC: WorkflowEntryService) {
    this.entry = { name: '', description: '', descriptor: '', graph: '' };
  }

  ngOnInit() {
    this.jointSVC.isWorkflowInitialized.subscribe(isGraphValid => {
      this.isGraphValid = isGraphValid;
    });
    this.userform = this.initForm();
    this.subscribeToOperationChanges();
    this.subscribeToEntryChanges();
  }

  private subscribeToEntryChanges() {
    this.route.data.subscribe((data: { detail: WorkflowEntry }) => {
      this.entry = data.detail;
      console.log(this.entry);
    });
  }

  private subscribeToOperationChanges(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.operation = params.get('operation');
      console.log(this.operation);
    });
  }

  ngAfterViewInit() {
    if (this.operation === 'edit' && this.entry.graph) {
      this.jointSVC.uploadGraph(JSON.parse(this.entry.graph));
    }
  }

  initForm() {
    return this.fb.group({
      'name': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required),
    });
  }

  onBack() {
    this.router.navigate(['/authenticated/workflow-maint']);
  }

  // somethings not right here.
  onSubmit() {
    this.entry.descriptor = this.descriptorSVC.getYamlDescriptor();
    this.entry.graph = this.jointSVC.getGraphJSON();
    if (this.operation === 'create') {
      this.workflowEntrySVC.saveEntry(this.entry);
    } else if (this.operation === 'edit') {
      console.log(this.entry);
      this.workflowEntrySVC.updateEntry(this.entry);
    }

    this.router.navigate(['/authenticated/workflow-maint']);
  }
}
