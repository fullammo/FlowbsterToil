import { WorkflowEntry } from 'app/view-models/workflowEntry';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

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
    private workflowEntrySVC: WorkflowEntryService) { }

  ngOnInit() {
    this.initComponent();
    this.jointSVC.isWorkflowInitialized.subscribe(isGraphValid => {
      this.isGraphValid = isGraphValid;
    });
    this.userform = this.initForm();
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

  private initComponent() {
    this.entry = this.workflowEntrySVC.getEntry(this.route.snapshot.params['id']);
    this.operation = this.route.snapshot.params['operation'];
  }

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
