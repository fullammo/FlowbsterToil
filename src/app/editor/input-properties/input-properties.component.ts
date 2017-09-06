import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { InputPort } from 'app/editor/models/inputPort';

@Component({
  selector: 'toil-editor-input-properties',
  templateUrl: './input-properties.component.html',
  styleUrls: ['./input-properties.component.scss']
})
export class InputPropertiesComponent implements OnInit {

  userform: FormGroup;
  inputProps: InputPort;

  @Output() onSubmitDialog = new EventEmitter<InputPort>();
  @Output() InputPropsChange = new EventEmitter<InputPort>(); // not neccessary

  @ViewChild('f') myNgForm; // check issue#4190 on Angular material2 github site.

  @Input()
  get InputProps() {
    return this.inputProps;
  }

  set InputProps(val: InputPort) {
    this.inputProps = val;
    this.InputPropsChange.emit(this.inputProps);
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.userform = this.initForm();
  }

  initForm() {
    return this.fb.group({
    'name': new FormControl('', [Validators.required, Validators.pattern(/^(?!.*inPorts\d)/)]),
      'isCollector': new FormControl(''),
      'storagePattern': new FormControl({ value: '', disabled: true }),
    });
  }

  // refactor is neccessarry here.
  onCheckboxToggle() {
    if (this.userform.controls['isCollector'].value) {
      this.userform.controls['storagePattern'].enable();
    } else {
      this.userform.controls['storagePattern'].disable();
    }
  }

  // we need a method when collector is checked then the disabled attribute fails. when it is

  // emits FlowbsterNode information from the component and resets the form.
  onSubmit() {
    this.onSubmitDialog.emit(this.userform.value);
    this.myNgForm.resetForm();
  }
}

