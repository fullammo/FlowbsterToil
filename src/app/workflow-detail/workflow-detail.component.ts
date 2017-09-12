import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { JointService } from 'app/editor/shared/joint.service';
import { DescriptorService } from 'app/editor/shared/descriptor.service';
import { WorkflowEntryService } from 'app/services/workflow-entry.service';

@Component({
  selector: 'toil-workflow-detail',
  templateUrl: './workflow-detail.component.html',
  styleUrls: ['./workflow-detail.component.scss']
})
export class WorkflowDetailComponent implements OnInit {

  isGraphValid = false;
  userform: FormGroup;

  constructor(private jointSVC: JointService,
    private descriptorSVC: DescriptorService,
    private fb: FormBuilder,
    private router: Router,
    private workflowEntrySVC: WorkflowEntryService) { }

  ngOnInit() {
    this.jointSVC.isWorkflowInitialized.subscribe(isGraphValid => {
      this.isGraphValid = isGraphValid;
      console.log(isGraphValid);
    });
    this.userform = this.initForm();
  }

  initForm() {
    return this.fb.group({
      'name': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required),
    });
  }

  status() {
    console.log(this.jointSVC);
  }

  onSubmit() {

  }

}
