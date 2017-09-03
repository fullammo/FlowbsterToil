import { NodeValidator } from './../shared/customValidators';
import { JointService } from './../shared/joint.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { Workflow } from 'app/editor/models/workflow';

@Component({
  selector: 'toil-editor-workflow-properties',
  templateUrl: './workflow-properties.component.html',
  styleUrls: ['./workflow-properties.component.scss']
})
export class WorkflowPropertiesComponent implements OnInit {

  userform: FormGroup;
  workflowProps: Workflow;

  @Output() onSubmitDialog = new EventEmitter<Workflow>();
  @Output() WorkflowPropsChange = new EventEmitter<Workflow>(); // not neccessary

  @Input()
  get WorkflowProps() {
    return this.workflowProps;
  }

  set WorkflowProps(val: Workflow) {
    this.workflowProps = val;
    this.WorkflowPropsChange.emit(this.workflowProps);
  }

  constructor(private fb: FormBuilder, private jointSVC: JointService) { }

  ngOnInit() {
    this.userform = this.fb.group({
      'infraid': new FormControl('', Validators.required),
      'userid': new FormControl('', Validators.required),
      'infraname': new FormControl('', Validators.required, NodeValidator.isWorkflowUnique(this.jointSVC)),
      'collectorip': new FormControl('', Validators.required),
      'collectorport': new FormControl('', Validators.required),
      'receiverport': new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    this.onSubmitDialog.emit(this.userform.value);
  }

}

