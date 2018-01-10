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
  AbstractControl
} from '@angular/forms';

import { FlowbsterNode } from './flowbsterNode';
import { JointService } from 'app/editor/flowbster-forms/shared/joint.service';
import { NodeValidator } from 'app/editor/flowbster-forms/shared/customValidators';


/**
 * Holds the logic to get the configuration from the user about a Flowbster Node.
 */
@Component({
  selector: 'toil-editor-node-properties',
  templateUrl: './node-properties.component.html',
  styleUrls: ['./node-properties.component.scss']
})
export class NodePropertiesComponent implements OnInit {

  /**
   * An indicator provided by the parent component about the Input controls accessibility.
   */
  @Input() readOnly: boolean;

  /**
   * Output Form group that holds neccessary information about the controls.
   */
  userform: FormGroup;

  /**
   * Modifiable Flowbster Node entity, that represents the demanded Flowbster node information.
   */
  nodeProps: FlowbsterNode;

  /**
   * Indicates wether the actual node exists or not.
   */
  isExistingNode: boolean;
  // @Input() isExistingNode: boolean;

  /**
   * Informs the parent component wether the Update action has been submitted.
   */
  @Output() onUpdateDialog = new EventEmitter<FlowbsterNode>();

  /**
   * Informs the parent component wether the Create action has been submitted.
   */
  @Output() onCreateDialog = new EventEmitter<FlowbsterNode>();

  /**
   * Informs the parent component wether the Clone action has been submitted.
   */
  @Output() onCloneDialog = new EventEmitter<FlowbsterNode>();

  /** Useful for two way databinding. Emits information about Node changes to the parent component */
  @Output() NodePropsChange = new EventEmitter<FlowbsterNode>(); // not neccessary

  /**
   * Angular's ngForm to be acccesed from code.
   */
  @ViewChild('f') myNgForm; // check issue#4190 on Angular material2 github site.

  /**
   * Gets and sets the Flowbster Node component from the parent component.
   */
  @Input()
  get NodeProps() {
    return this.nodeProps;
  }

  set NodeProps(val: FlowbsterNode) {
    this.nodeProps = val;
    this.NodePropsChange.emit(this.nodeProps);
  }

  /**
   * A reference for the name form control.
   */
  private nameControl: AbstractControl;

  /**
   * Initializes the needed services.
   */
  constructor(private fb: FormBuilder, private jointSVC: JointService) {}

  /**
   * Initializes the form,assigns the name formcontrol to the reference
   *  and subscribes to a Node changing tracker.
   */
  ngOnInit() {
    this.userform = this.initForm();
    this.nameControl = this.userform.controls['name'];
    this.subscribeToNodeChanges();
  }

  /**
   * Enlists on a datafeed that informs us about if a user clicks on any node on the paper,
   * and sets the required validators for the situation and the connected indicator.
   */
  private subscribeToNodeChanges() {
    this.jointSVC.isExistingNodeSubject.subscribe(isExistingNode => {
      if (isExistingNode) {
        this.setExistingNodeValidators();
      } else {
        this.setNewNodeValidators();
      }
      this.isExistingNode = isExistingNode;
    });
  }

  /**
   * Sets the update condition validators for the name form control and resets it.
   */
  private setExistingNodeValidators() {
    console.log('doing the job');
    this.nameControl.clearAsyncValidators();
    this.nameControl.setAsyncValidators([
      NodeValidator.isUpdateUnique(this.jointSVC)
    ]);
    this.nameControl.updateValueAndValidity();
  }

  /**
   * Sets the validators of the New node creation condition for the name form control and resets it.
   */
  private setNewNodeValidators() {
    this.nameControl.clearAsyncValidators();
    this.nameControl.setAsyncValidators([
      NodeValidator.isNodeUnique(this.jointSVC)
    ]);
    this.nameControl.updateValueAndValidity();
  }

  /**
   * Initializes the Node form group with its required validators.
   */
  initForm() {
    const formState = { value: '', disabled: this.readOnly };
    const numberFormState = { value: '1', disabled: this.readOnly };

    return this.fb.group({
      name: new FormControl(formState, Validators.required),
      execname: new FormControl(formState, Validators.required),
      args: new FormControl(formState),
      execurl: new FormControl(formState, Validators.required),
      scalingmin: new FormControl(numberFormState, [
        Validators.min(1),
        Validators.required
      ]), // TODO:custom validator for  whole number
      scalingmax: new FormControl(numberFormState, [
        Validators.min(1),
        Validators.required
      ]) // TODO: custom validator for whole number
    });
  }

  /**
   * When the create button is clicked it emits the Node information, and resets the full form.
   */
  onCreate() {
    this.onCreateDialog.emit(this.userform.value);
    this.myNgForm.resetForm();
  }

   /**
   * When the Update button is clicked it emits the Node information, and resets the full form.
   */
  onUpdate() {
    this.onUpdateDialog.emit(this.userform.value);
    this.myNgForm.resetForm();
  }

   /**
   * When the Clone button is clicked it emits the Node information, and resets the full form.
   */
  onClone() {
    this.onCloneDialog.emit(this.userform.value);
    this.myNgForm.resetForm();
  }

  // hasonlóra van szükség a isExistingNode-al egyetemben, de nem biztos hogy ez rendjén való.
  // this.userform.get('infraname').valueChanges.subscribe(
  //   (infraname: string) => {
  //     this.userform.get('infraname').setValidators([Validators.required, forbiddenNameValidator(this.jointSVC.getNodeNames())]);
  //     this.userform.get('infraname').updateValueAndValidity();
  //   }
  // );
}
