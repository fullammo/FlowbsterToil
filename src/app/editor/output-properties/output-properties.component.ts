import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { OutputPort } from "app/editor/models/outputPort";
import { DistributionType } from "app/editor/models/distributionType";

@Component({
  selector: 'toil-editor-output-properties',
  templateUrl: './output-properties.component.html',
  styleUrls: ['./output-properties.component.scss']
})
export class OutputPropertiesComponent implements OnInit {

  userform: FormGroup;
  outputProps: OutputPort;

  distributionTypes = DistributionType;

  @Output() onSubmitDialog = new EventEmitter<OutputPort>();
  @Output() OutputPropsChange = new EventEmitter<OutputPort>(); // not neccessary

  @ViewChild('f') myNgForm; // check issue#4190 on Angular material2 github site.

  @Input()
  get OutputProps() {
    return this.outputProps;
  }

  set OutputProps(val: OutputPort) {
    this.outputProps = val;
    this.OutputPropsChange.emit(this.outputProps);
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.userform = this.initForm();
  }

  initForm() {
    return this.fb.group({
      'name': new FormControl('', Validators.required), // TODO: custom validator for node match
      'fileName': new FormControl('', Validators.required),
      'targetName': new FormControl(''),
      'targetIp': new FormControl(''),
      'targetPort': new FormControl(''),
      'isGenerator': new FormControl(''),
      'filterExpression': new FormControl({ value: '', disabled: true }),
      'distributionType': new FormControl({ value: '', disabled: true })
    });
  }

  onCheckboxToggle() {
    if (this.userform.controls['isGenerator'].value) {
      this.userform.controls['distributionType'].enable();
      this.userform.controls['filterExpression'].enable();
    } else {
      this.userform.controls['distributionType'].disable();
      this.userform.controls['filterExpression'].disable();
    }
  }

  // emits FlowbsterNode information from the component and resets the form.
  onSubmit() {
    this.onSubmitDialog.emit(this.userform.value);
    this.myNgForm.resetForm();
  }
}
