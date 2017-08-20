import { Component, OnInit } from '@angular/core';
import { MdSliderChange } from "@angular/material/material";

import { InputPort } from "app/editor/models/inputPort";
import { FlowbsterNode } from "app/editor/models/flowbsterNode";
import { OutputPort } from "app/editor/models/outputPort";
import { JointService } from "app/editor/shared/joint.service";

import { Message } from "primeng/components/common/message";

@Component({
  selector: 'toil-editor-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.scss']
})
export class PaperComponent implements OnInit {

  msgs: Message[] = [];

  outputModalVisible: boolean;
  inputModalVisible: boolean;
  nodeModalVisible: boolean;

  sliderValue = 100;
  minSliderValue = 1;

  constructor(public jointSVC: JointService) { }

  // initialize domElement to a paper and enlist on events.
  ngOnInit() {
    const paperElement = $('#paper');
    this.jointSVC.initPaper(paperElement);
    this.jointSVC.listenOnBlankClick(this, 'nodeModalVisible');
    // this.jointSVC.logAllEvents();
    this.jointSVC.listenOnPointerUp(this, 'inputModalVisible', 'outputModalVisible');
    this.jointSVC.listenOnCellClick();
    this.jointSVC.listenOnCellDoubleClick(this, 'nodeModalVisible');
  }

  // shuts down the nodeModal and creates a Node on the paper
  nodeCreateDialogChanged(newNode: FlowbsterNode) {
    this.nodeModalVisible = false;
    this.tryNodeCreation(newNode);
  }

  nodeUpdateDialogChanged(updatedNode: FlowbsterNode) {
    this.nodeModalVisible = false;
    this.tryNodeUpdate(updatedNode);
  }

  inputDialogChanged(updatedInputProps: InputPort) {
    this.inputModalVisible = false;
    this.tryInputUpdate(updatedInputProps);

  }

  outputDialogChanged(updatedOutputProps: OutputPort) {
    this.outputModalVisible = false;
    this.tryOutputUpdate(updatedOutputProps);
  }

  onSliderChanged(event: MdSliderChange) {
    this.jointSVC.reScalePaper(event.value);
  }

  // tries to update a node with jointService on the paper and emits some messages
  private tryNodeUpdate(updatedNode: FlowbsterNode) {
    if (this.jointSVC.updateNode(updatedNode)) {
      this.sendStickyMessage(true, `Node '${updatedNode.name}' updated!`);
    } else {
      this.sendStickyMessage(false, `Node '${updatedNode.name}' was a failure`);
    }

  }

  // tries to update an output with jointService on the paper and emits some messages
  private tryOutputUpdate(updatedOutputProps: OutputPort) {
    if (this.jointSVC.updatePort(updatedOutputProps, false)) {
      this.sendStickyMessage(true, `Output port '${updatedOutputProps.name}' updated!`);
    } else {
      this.sendStickyMessage(false, `Output port name '${updatedOutputProps.name}' already exists!`);
    }
  }

  // tries to update an input with jointService on the paper and emits some messages
  private tryInputUpdate(updatedInputProps: InputPort) {
    if (this.jointSVC.updatePort(updatedInputProps, true)) {
      this.sendStickyMessage(true, `Input port '${updatedInputProps.name}' updated!`);
    } else {
      this.sendStickyMessage(false, `Input port name '${updatedInputProps.name}' already exists!`);
    }
  }

  // tries to create a new node with jointService on the paper and emits some messages
  private tryNodeCreation(newNode: FlowbsterNode) {
    if (this.jointSVC.createNode(newNode)) {
      this.sendStickyMessage(true, `Node '${newNode.name}' created `);
    } else {
      this.sendStickyMessage(false, `Node name '${newNode.name}' already exists!`);
    }
  }

  // emits your message based on if its a succes or error message
  private sendStickyMessage(isSuccess: boolean, message: string) {
    if (isSuccess) {
      this.msgs.push({ severity: 'success', summary: 'Success', detail: message });
    } else {
      this.msgs.push({ severity: 'error', summary: 'Error', detail: message });
    }
  }
}
