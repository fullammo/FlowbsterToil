import { NodeValidator } from './../shared/customValidators';
import { JointService } from './../shared/joint.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { Workflow } from 'app/editor/models/workflow';


/**
 * Modal form component for the Flowbster Workflow's Main Attributes.
 * It emits submit data and waiting for initial Workflow property values.
 * @example
 * <toil-editor-workflow-properties (onSubmitDialog)="workflowDialogChange($event)" [(WorkflowProps)]="workflow">
 */
@Component({
  selector: 'toil-editor-workflow-properties',
  templateUrl: './workflow-properties.component.html',
  styleUrls: ['./workflow-properties.component.scss']
})
export class WorkflowPropertiesComponent implements OnInit {

  /**
   * The FormGroup to hold the user's input
   */
  workflowForm: FormGroup;

  /**
   * Holder of the incoming workflow properties.
   */
  workflowProps: Workflow;

  /**
   * Emits data outside of the component with the submitted workflow data.
   */
  @Output() onSubmitDialog = new EventEmitter<Workflow>();

  /**
   * Emits data outside of the component of the inner workflow's attributes.
   */
  @Output() WorkflowPropsChange = new EventEmitter<Workflow>(); // not neccessary

  /**
   * Returns the workflowProps property.
   */
  @Input()
  get WorkflowProps() {
    return this.workflowProps;
  }

  /**
   * Sets the inner workflowProps property.
   */
  set WorkflowProps(val: Workflow) {
    this.workflowProps = val;
    this.WorkflowPropsChange.emit(this.workflowProps);
  }

  /**
   * We inject the needed services.
   */
  constructor(private fb: FormBuilder, private jointSVC: JointService) { }

  /**
   * Initializes the workflow form with proper validators.
   */
  ngOnInit() {
    this.workflowForm = this.fb.group({
      'infraid': new FormControl('', Validators.required),
      'userid': new FormControl('', Validators.required),
      'infraname': new FormControl('', Validators.required, NodeValidator.isWorkflowUnique(this.jointSVC)),
      'collectorip': new FormControl('', Validators.required),
      'collectorport': new FormControl('', Validators.required),
      'receiverport': new FormControl('', Validators.required)
    });
  }

  /**
   * When the submit button is clicked, we emit the workflowforms data.
   */
  onSubmit() {
    this.onSubmitDialog.emit(this.workflowForm.value);
  }

}

