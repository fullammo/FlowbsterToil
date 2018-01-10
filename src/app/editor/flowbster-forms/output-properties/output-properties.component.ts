import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { OutputPort } from './outputPort';
import { PortValidator } from 'app/editor/flowbster-forms/shared/customValidators';
import { JointService } from 'app/editor/flowbster-forms/shared/joint.service';
import { DistributionType } from 'app/editor/flowbster-forms/shared/distributionType';

/**
 * Holds the logic for the Output form interaction and configuration.
 */
@Component({
  selector: 'toil-editor-output-properties',
  templateUrl: './output-properties.component.html',
  styleUrls: ['./output-properties.component.scss']
})
export class OutputPropertiesComponent implements OnInit {

  /**
   * An indicator provided by the parent component about the Input controls accessibility.
   */
  @Input()
  readOnly: boolean;

  /**
   * Output Form group that holds neccessary information about the controls.
   */
  userform: FormGroup;

  /**
   * Modifiable Output port entity, that represents the demanded Output information.
   */
  outputProps: OutputPort;

  /**
   * Holder of the supported distribution types.
   */
  distributionTypes = DistributionType;

  /**
   * Emit events to other component when the Output information is submitted.
   */
  @Output() onSubmitDialog = new EventEmitter<OutputPort>();

  /** Useful for two way databinding. Emits information about Output changes to the parent component */
  @Output() OutputPropsChange = new EventEmitter<OutputPort>(); // not neccessary

  /**
   * Angular's ngForm to be acccesed from code.
   */
  @ViewChild('f') myNgForm; // check issue#4190 on Angular material2 github site.

  /**
   * Gets and sets the Flowbster Node component from the parent component.
   */
  @Input()
  get OutputProps() {
    return this.outputProps;
  }

  /**
   * Sets the insider output properties.
   */
  set OutputProps(val: OutputPort) {
    this.outputProps = val;
    this.OutputPropsChange.emit(this.outputProps);
  }

  /**
   * Initializes the needed services.
   */
  constructor(private fb: FormBuilder, private jointSVC: JointService) { }

  /**
   * The user form gets assigned.
   */
  ngOnInit() {
    this.userform = this.initForm();
  }

  /**
   * Initializes the Form group with special form controsl and their validators.
   */
  initForm() {
    const formState = { value: '', disabled: this.readOnly };

    return this.fb.group({
      // TODO : better pattern is needed
      'displayName': new FormControl(formState, [Validators.required],
        PortValidator.isPortUnique(this.jointSVC)),
      // something we need to protect the pattern. Better error messaging.Validators.pattern(/^(?!.*Port\d)/)
      'name': new FormControl(formState, Validators.required),
      'targetname': new FormControl(formState),
      'targetip': new FormControl(formState),
      'targetport': new FormControl(formState),
      'isGenerator': new FormControl(formState),
      'filter': new FormControl({ value: '', disabled: true }),
      'distribution': new FormControl({ value: '', disabled: true })
    });
  }

  /**
   * Whenever the checkbox is toggled the associated form controls are also toggled.
   */
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
  /**
   * The work
   */
  onSubmit() {
    this.onSubmitDialog.emit(this.userform.value);
    this.myNgForm.resetForm();
  }
}
