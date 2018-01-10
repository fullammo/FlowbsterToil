import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ViewChild
} from '@angular/core';
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder,
  NgForm
} from '@angular/forms';
import { InputPort } from './inputPort';
import { JointService } from 'app/editor/flowbster-forms/shared/joint.service';
import { PortValidator } from 'app/editor/flowbster-forms/shared/customValidators';


/**
 * Holds the logic for the Input form interaction and configuration.
 */
@Component({
  selector: 'toil-editor-input-properties',
  templateUrl: './input-properties.component.html',
  styleUrls: ['./input-properties.component.scss']
})
export class InputPropertiesComponent implements OnInit {
  /**
   * An indicator provided by the parent component about the Input controls accessibility.
   */
  @Input() readOnly: boolean;

  /**
   * Input Form group that holds neccessary information about the controls.
   */
  userform: FormGroup;

  /**
   * Modifiable Input port entity, that represents the demanded Input information.
   */
  inputProps: InputPort;

  /**
   * Emit events to other component when the Input information is submitted.
   */
  @Output() onSubmitDialog = new EventEmitter<InputPort>();

  /**
   * Angular's ngForm to be acccesed from code.
   */
  @ViewChild('f') myNgForm: NgForm; // check issue#4190 on Angular material2 github site.

  /**
   * Gets and sets the Input component from the parent component.
   */
  @Input()
  get InputProps() {
    return this.inputProps;
  }

  /**
   * Sets the private input component.
   */
  set InputProps(val: InputPort) {
    this.inputProps = val;
  }

  /**
   * Initializes the needed services.
   */
  constructor(private fb: FormBuilder, private jointSVC: JointService) {}

  /**
   * Initializes the userform.
   */
  ngOnInit() {
    this.userform = this.initForm();
  }

  /**
   * Initializes the Input form component with its required validators.
   */
  initForm() {
    const formState = { value: '', disabled: this.readOnly };
    return this.fb.group({
      displayName: new FormControl(
        formState,
        [Validators.required],
        PortValidator.isPortUnique(this.jointSVC)
      ),
      // something we need to protect the pattern. Better error messaging.Validators.pattern(/^(?!.*Port\d)/)
      name: new FormControl(formState, Validators.required),
      collector: new FormControl(formState),
      format: new FormControl({ value: '', disabled: true })
    });
  }

  // refactor is neccessarry here.
  /**
   * Whenever the checkbox is toggled, the format controls accessibility is switched.
   */
  onCheckboxToggle() {
    const formatControl = this.userform.controls['format'];
    if (this.userform.controls['collector'].value) {
      formatControl.enable();
    } else {
      formatControl.disable();
    }
  }

  // we need a method when collector is checked then the disabled attribute fails. when it is

  /**
   * Emits Input information from the componenet and resets the form.
   */
  onSubmit() {
    this.onSubmitDialog.emit(this.userform.value);
    this.myNgForm.resetForm();
  }
}
