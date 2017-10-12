import { Component, OnInit, Input } from '@angular/core';
import { MatSliderChange } from '@angular/material/material';

import { InputPort } from 'app/editor/models/inputPort';
import { FlowbsterNode } from 'app/editor/models/flowbsterNode';
import { OutputPort } from 'app/editor/models/outputPort';
import { JointService } from 'app/editor/shared/joint.service';

import { Message } from 'primeng/components/common/message';

/**
 * Maintains the drawing areas events and ModalChanges with the help of
 * {@link JointService}
 */
@Component({
  selector: 'toil-editor-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.scss']
})
export class PaperComponent implements OnInit {

  /**
   * An indicator from outside which decides that
   * the visual graph should be read only.
   */
  @Input()
  readOnly: boolean;

  /**
   * Holder of Toastr messages displayed.
   */
  msgs: Message[] = [];

  /**
   * Indicator to trigger the {@link OutputPropertiesComponent}.
   */
  outputModalVisible: boolean;

  /**
   * Indicator to trigger the  {@link InputPropertiesComponent}.
   */
  inputModalVisible: boolean;

  /**
   * Indicator to trigger the {@link NodePropertiesComponent}.
   */
  nodeModalVisible: boolean;

  /**
   * Initial value of the slider widget.
   */
  sliderValue = 100;

  /**
   * The minimal value that will be displayed on the slider widget.
   */
  minSliderValue = 1;

  /**
   * We inject the needed services.
   * @param jointSVC Enlist to events given by JointJS and handle the Modals input data.
   */
  constructor(public jointSVC: JointService) { }

  /**
   * Reinitalizes the graph, sets the DOMElement of the paper and enlist on events neccesary in the given mode.
   */
  ngOnInit() {

    this.jointSVC.clearGraph();
    const paperElement = $('#paper');
    this.jointSVC.initPaper(paperElement, this.readOnly);

    if (!this.readOnly) {
      this.jointSVC.listenOnBlankClick(this, 'nodeModalVisible');
    }

    this.jointSVC.listenOnGraphChange();
    this.jointSVC.listenOnPointerUp(this, 'inputModalVisible', 'outputModalVisible', this.readOnly);
    this.jointSVC.listenOnCellClick(this.readOnly);
    this.jointSVC.listenOnCellDoubleClick(this, 'nodeModalVisible');
  }

  /**
   * Shuts down the {@link NodePropertiesComponent} and creates a Node on the paper
   * @param newNode Node Modal form data.
   */
  nodeCreateDialogChanged(newNode: FlowbsterNode) {
    this.nodeModalVisible = false;
    this.tryNodeCreation(newNode);
  }

  /**
   * Shuts down the {@link NodePropertiesComponent} and clones the selected node on the paper
   * @param newNode Node Modal form data.
   */
  nodeCloneDialogChanged(newNode: FlowbsterNode) {
    this.nodeModalVisible = false;
    this.tryNodeCloning(newNode);
  }

  /**
   * Shuts down the {@link NodePropertiesComponent} and updates the selected node on the paper.
   * @param newNode Node Modal form data.
   */
  nodeUpdateDialogChanged(updatedNode: FlowbsterNode) {
    this.nodeModalVisible = false;
    this.tryNodeUpdate(updatedNode);
  }

  /**
   * Shuts down the {@link InputPropertiesComponent} and updates the selected input on the paper.
   * @param updatedInputProps Input Modal form data.
   */
  inputDialogChanged(updatedInputProps: InputPort) {
    this.inputModalVisible = false;
    this.tryInputUpdate(updatedInputProps);

  }

  /**
   * Shuts down the {@link OutputPropertiesComponent} and updates the selected output on the paper.
   * @param updatedOutputProps Output Modal form data.
   */
  outputDialogChanged(updatedOutputProps: OutputPort) {
    this.outputModalVisible = false;
    this.tryOutputUpdate(updatedOutputProps);
  }

  /**
   * When the slider is changed, the paper is resized by the fired events value.
   * @param event Angular Material 2 SliderChange event.
   */
  onSliderChanged(event: MatSliderChange) {
    this.jointSVC.reScalePaper(event.value);
  }

  /**
   * Tries to update a node on the paper and emits Toastr messages about the result.
   * @param updatedNode Node Modal data.
   */
  private tryNodeUpdate(updatedNode: FlowbsterNode) {
    if (this.jointSVC.updateNode(updatedNode)) {
      this.sendStickyMessage(true, `Node '${updatedNode.name}' updated!`);
    } else {
      this.sendStickyMessage(false, `Node '${updatedNode.name}' was a failure`);
    }

  }

  /**
   * Tries to clone a node on the paper and emits Toastr messages about the result.
   * @param clonedNode Node Modal data.
   */
  private tryNodeCloning(clonedNode: FlowbsterNode) {
    if (this.jointSVC.cloneNode(clonedNode)) {
      this.sendStickyMessage(true, `Node '${clonedNode.name}' cloned!`);
    } else {
      this.sendStickyMessage(false, `Node '${clonedNode.name}' was a failure`);
    }
  }

  /**
   * Tries to update the selected output on the paper and emits Toastr messages about the result.
   * @param updatedOutputProps Output Modal form data.
   */
  private tryOutputUpdate(updatedOutputProps: OutputPort) {
    this.jointSVC.updateOutPort(updatedOutputProps);
    // if (this.jointSVC.updatePort(updatedOutputProps, false)) {
    //   this.sendStickyMessage(true, `Output port '${updatedOutputProps.name}' updated!`);
    // } else {
    //   this.sendStickyMessage(false, `Output port name '${updatedOutputProps.name}' already exists!`);
    // }
  }

  /**
   * Tries to update the selected input on the paper and emits Toastr messages about the result.
   * @param updatedInputProps Input Modal form data.
   */
  private tryInputUpdate(updatedInputProps: InputPort) {

    this.jointSVC.updateInPort(updatedInputProps);
    // if (this.jointSVC.updatePort(updatedInputProps, true)) {
    //   this.sendStickyMessage(true, `Input port '${updatedInputProps.name}' updated!`);
    // } else {
    //   this.sendStickyMessage(false, `Input port name '${updatedInputProps.name}' already exists!`);
    // }
  }

  /**
   * Tries to create a node on the paper and emits Toastr messages about the result.
   * @param newNode Node Modal form data.
   */
  private tryNodeCreation(newNode: FlowbsterNode) {
    if (this.jointSVC.createNode(newNode)) {
      this.sendStickyMessage(true, `Node '${newNode.name}' created `);
    } else {
      this.sendStickyMessage(false, `Node name '${newNode.name}' already exists!`);
    }
  }

  /**
   * Emits your message on a Toast based on if its a succes or error message.
   * @param isSuccess indicator, which decides if it was a successfull operation.
   * @param message the emitted message, which appears on the Toast.
   */
  private sendStickyMessage(isSuccess: boolean, message: string) {
    if (isSuccess) {
      this.msgs.push({ severity: 'success', summary: 'Success', detail: message });
    } else {
      this.msgs.push({ severity: 'error', summary: 'Error', detail: message });
    }
  }
}
