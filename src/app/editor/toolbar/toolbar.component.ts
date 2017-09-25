import { Component, OnInit } from '@angular/core';

import { Message } from 'primeng/components/common/message';
import { MenuItem } from 'primeng/components/common/menuitem';

import { DescriptorService } from 'app/editor/shared/descriptor.service';
import { JointService } from 'app/editor/shared/joint.service';
import { Workflow } from 'app/editor/models/workflow';

@Component({
  selector: 'toil-editor-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  msgs: Message[] = [];
  items: MenuItem[];
  editClicked: boolean;

  uploadedFiles: any[] = [];

  constructor(private descriptorSVC: DescriptorService, public jointSVC: JointService) { }

  ngOnInit() {
    this.editClicked = false;
    this.items = this.createToolBarItems();
  }

  workflowDialogChange(newWorkflow: Workflow) {
    this.editClicked = false;
    this.jointSVC.updateWorkflowProperties(newWorkflow);
    this.descriptorSVC.updateDescriptorProperties(newWorkflow);
    this.msgs.push({ severity: 'success', summary: 'Success', detail: 'Workflow properties updated!' });
    // deploy to some outside method to let them call with your own details.
  }

  myUploader(event) {
    const file = event.files[0];
    const reader = new FileReader();
    const self = this;

    reader.onload = (function (theFile) {
      return function (e) {
        console.log(e);
        self.jointSVC.uploadGraph(JSON.parse(e.target.result));
      }
    })(file);

    reader.readAsText(file); // confirm dialog before this.
  }

  createToolBarItems(): MenuItem[] {
    return [
      {
        label: 'Workflow Settings',
        items: [
          {
            label: 'Edit Properties', icon: 'fa-microchip', command: (event) => {
              this.editClicked = true;
            }
          },
        ]
      },
      {
        label: 'Drawing Controls',
        items: [
          {
            label: 'Add Input port', icon: 'fa-plus-circle', command: (event) => {

              this.jointSVC.addPort('inPorts');
            }
          },
          {
            label: 'Add Output port', icon: 'fa-plus-circle', command: (event) => {

              this.jointSVC.addPort('outPorts');
            }
          },
          {
            label: 'Delete port', icon: 'fa-times-circle', command: (event) => {

              this.jointSVC.deletePort();
            }
          },
          {
            label: 'Delete node', icon: 'fa-times-circle', command: (event) => {
              console.log('Im about to delete a node');
              this.jointSVC.deleteNode();
            }
          },
        ]
      },
      {
        label: 'File Sharing',
        items: [
          {
            label: 'Download Descriptor', icon: 'fa-download', command: (event) => {
              this.descriptorSVC.updateDescriptorProperties(this.jointSVC.workflow);
              this.descriptorSVC.downloadYamlDescriptor('occopus.yaml', 'application/x-yaml');
            }
          },
          {
            label: 'Download Graph', icon: 'fa-download', command: (event) => {
              this.jointSVC.downloadGraph('graph.json', 'application/json');
            }
          }
        ]
      }
    ];
  }
}
