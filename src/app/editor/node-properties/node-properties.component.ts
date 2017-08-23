import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { FlowbsterNode } from 'app/editor/models/flowbsterNode'

@Component({
  selector: 'toil-editor-node-properties',
  templateUrl: './node-properties.component.html',
  styleUrls: ['./node-properties.component.scss']
})
export class NodePropertiesComponent implements OnInit {

  userform: FormGroup;
  nodeProps: FlowbsterNode;

  @Input() isExistingNode: boolean;

  @Output() onUpdateDialog = new EventEmitter<FlowbsterNode>();
  @Output() onCreateDialog = new EventEmitter<FlowbsterNode>();
  @Output() onCloneDialog = new EventEmitter<FlowbsterNode>();
  @Output() NodePropsChange = new EventEmitter<FlowbsterNode>(); // not neccessary

  @ViewChild('f') myNgForm; // check issue#4190 on Angular material2 github site.



  @Input()
  get NodeProps() {
    return this.nodeProps;
  }

  set NodeProps(val: FlowbsterNode) {
    this.nodeProps = val;
    this.NodePropsChange.emit(this.nodeProps);
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.userform = this.initForm();
  }

  initForm() {
    return this.fb.group({
      'name': new FormControl('', Validators.required), // TODO: custom validator for node match
      'execname': new FormControl('', Validators.required),
      'args': new FormControl(''),
      'execurl': new FormControl('', Validators.required),
      'scalingmin': new FormControl('1', [Validators.min(1), Validators.required]), // TODO:custom validator for  whole number
      'scalingmax': new FormControl('1', [Validators.min(1), Validators.required]) // TODO: custom validator for whole number
    });
  }

  // emits FlowbsterNode information from the component and resets the form.
  onCreate() {
    this.onCreateDialog.emit(this.userform.value);
    this.myNgForm.resetForm();
  }

  onUpdate() {
    this.onUpdateDialog.emit(this.userform.value);
    this.myNgForm.resetForm();
  }

  onClone() {
    this.onCloneDialog.emit(this.userform.value);
    this.myNgForm.resetForm();
  }
}

