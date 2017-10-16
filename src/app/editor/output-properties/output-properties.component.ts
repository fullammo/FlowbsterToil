import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { OutputPort } from 'app/editor/models/outputPort';
import { DistributionType } from 'app/editor/models/distributionType';

@Component({
  selector: 'toil-editor-output-properties',
  templateUrl: './output-properties.component.html',
  styleUrls: ['./output-properties.component.scss']
})
export class OutputPropertiesComponent implements OnInit {

  @Input()
  readOnly: boolean;

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
    const formState = { value: '', disabled: this.readOnly };

    return this.fb.group({
      // TODO : better pattern is needed
      'displayName': new FormControl(formState, [Validators.required, Validators.pattern(/^(?!.*outPorts\d)/)]),
      'name': new FormControl(formState, Validators.required),
      'targetname': new FormControl(formState),
      'targetip': new FormControl(formState),
      'targetport': new FormControl(formState),
      'isGenerator': new FormControl(formState),
      'filter': new FormControl({ value: '', disabled: true }),
      'distribution': new FormControl({ value: '', disabled: true })
    });
  }

  onCheckboxToggle() {
    if (this.userform.controls['isGenerator'].value) {
      this.userform.controls['distribution'].enable();
      this.userform.controls['filter'].enable();
    } else {
      this.userform.controls['distribution'].disable();
      this.userform.controls['filter'].disable();
    }
  }

  // emits FlowbsterNode information from the component and resets the form.
  onSubmit() {
    this.onSubmitDialog.emit(this.userform.value);
    this.myNgForm.resetForm();
  }
}
