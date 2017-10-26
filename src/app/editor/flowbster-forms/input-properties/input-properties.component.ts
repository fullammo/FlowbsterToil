import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { InputPort } from 'app/editor/models/inputPort';
import { JointService } from 'app/editor/flowbster-forms/shared/joint.service';
import { PortValidator } from 'app/editor/flowbster-forms/shared/customValidators';

@Component({
  selector: 'toil-editor-input-properties',
  templateUrl: './input-properties.component.html',
  styleUrls: ['./input-properties.component.scss']
})
export class InputPropertiesComponent implements OnInit {

  @Input()
  readOnly: boolean;

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

  constructor(private fb: FormBuilder, private jointSVC: JointService) { }

  ngOnInit() {
    this.userform = this.initForm();
  }

  initForm() {
    const formState = { value: '', disabled: this.readOnly };
    return this.fb.group({
      'displayName': new FormControl(formState, [Validators.required],
        PortValidator.isPortUnique(this.jointSVC)),
      // something we need to protect the pattern. Better error messaging.Validators.pattern(/^(?!.*Port\d)/)
      'name': new FormControl(formState, Validators.required),
      'collector': new FormControl(formState),
      'format': new FormControl({ value: '', disabled: true }),
    });
  }

  // refactor is neccessarry here.
  onCheckboxToggle() {
    if (this.userform.controls['collector'].value) {
      this.userform.controls['format'].enable();
    } else {
      this.userform.controls['format'].disable();
    }
  }

  // we need a method when collector is checked then the disabled attribute fails. when it is

  // emits FlowbsterNode information from the component and resets the form.
  onSubmit() {
    this.onSubmitDialog.emit(this.userform.value);
    this.myNgForm.resetForm();
  }
}

