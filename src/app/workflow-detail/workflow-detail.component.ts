import { WorkflowEntry } from 'app/view-models/workflowEntry';
import { Component, OnInit } from '@angular/core';
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
export class WorkflowDetailComponent implements OnInit {

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

  initForm() {
    return this.fb.group({
      'name': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required),
    });
  }

  private initComponent() {
    this.operation = this.route.snapshot.params['operation'];
    this.entry = this.workflowEntrySVC.getEntry(this.route.snapshot.params['id']);
    console.log(this.operation);
    console.log(this.entry);
  }

  private createEntry(): WorkflowEntry {
    return {
      name: this.userform.controls['name'].value,
      description: this.userform.controls['description'].value,
      graph: this.jointSVC.getGraphJSONString(),
      descriptor: this.descriptorSVC.getYamlDescriptor(),
    };
  }

  onSubmit() {
    const entry = this.createEntry();
    this.workflowEntrySVC.saveEntry(entry);
    this.router.navigate(['/authenticated/workflow-maint']);
  }

}
