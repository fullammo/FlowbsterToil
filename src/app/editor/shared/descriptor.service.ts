import { Injectable } from '@angular/core';
import { OccopusDescriptor } from 'app/editor/models/occopusDescriptor';
import { JointService } from 'app/editor/shared/joint.service';
import { Workflow } from 'app/editor/models/workflow';
import { OutPutDescriptor } from 'app/editor/models/outputDescriptor';
import { NodeDescriptor } from 'app/editor/models/nodeDescriptor';
import { InputDescriptor } from 'app/editor/models/inputDescriptor';

import * as jsyaml from 'js-yaml';

@Injectable()
export class DescriptorService {

  occopusDescriptor: OccopusDescriptor;

  constructor(private jointSVC: JointService) { this.occopusDescriptor = this.initOccopusDescriptor() }

  // sets the workflowProperties and the occopus descriptors neccessary properties.
  updateDescriptorProperties(newWorkflow: Workflow) {
    this.occopusDescriptor.user_id = newWorkflow.userid;
    this.occopusDescriptor.infra_name = newWorkflow.infraname;
    this.occopusDescriptor.infra_id = newWorkflow.infraid;
    this.occopusDescriptor.variables.flowbster_global.collector_ip = '&collectorip ' + newWorkflow.collectorip;
    this.occopusDescriptor.variables.flowbster_global.collector_port = '&collectorport ' + newWorkflow.collectorport;
    this.occopusDescriptor.variables.flowbster_global.receiver_port = '&receiverport ' + newWorkflow.receiverport;
  }

  // initialize a clean Occopus Descriptor.
  initOccopusDescriptor(): OccopusDescriptor {
    return {
      user_id: '',
      infra_id: null,
      infra_name: '',
      variables: {
        flowbster_global: {
          collector_ip: '',
          collector_port: null,
          receiver_port: null
        }
      }
    }
  }

  // creates a YAML-formatted string from the actual papers graph as occopusDescriptor.
  getYamlDescriptor(): string {

    if (this.jointSVC.workflow) {
      this.updateOccopusDescriptor();

      console.log(this.occopusDescriptor);

      const yamlstring = this.finalizeDescriptor();
      console.log(yamlstring);
      return yamlstring;
    }

    return null;
  }

  // downloads the yaml descriptor (utilityService)
  downloadYamlDescriptor(fileName: string, mimeType: string): void {
    if (this.occopusDescriptor && this.jointSVC.workflow) {
      const elHtml = this.getYamlDescriptor();
      const link = document.createElement('a');
      mimeType = mimeType || 'text/plain';

      link.setAttribute('download', fileName);
      link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log('Occopus descriptor or the workflow properties is not present');
    }

  }

  // sets the occo descriptors nodes and dependencies.
  updateOccopusDescriptor() {
    this.occopusDescriptor.nodes = this.createDescriptorNodes();
    this.occopusDescriptor.dependencies = this.handleDependencies();
  }

  // changes the names to be variables in proper yaml format and returns the valid YAML string.
  finalizeDescriptor(): string {
    const names = [];
    const subNames = [];
    let index = 0;
    for (const node of this.occopusDescriptor.nodes) {
      names[index] = node.name;
      subNames[index++] = 'name: ' + node.name;
    }

    let halfwayYaml = jsyaml.dump(this.occopusDescriptor, { lineWidth: -1, noCompatMode: true });

    for (let iii = 0; iii < names.length; iii++) {
      const firstPart = halfwayYaml.slice(0, halfwayYaml.indexOf(subNames[iii]));
      halfwayYaml = firstPart + '&' + names[iii] + '\n    ' + halfwayYaml.slice(halfwayYaml.indexOf(subNames[iii]));
    }

    // replace single quotes globally to whitespace and " to single quotation marks
    const doneYaml = halfwayYaml.replace(/'/g, ' ').replace(/"/g, '\'').replace(/\\/g, '\"');
    return doneYaml;
  }

  // corrects the outputs by the given dependencies and creates an array from the node dependency chain.
  // HINT: not neccessary to correct the outputs if we can do it on a higher level, maybe in the modal. not sure yet.
  handleDependencies(): Array<string> {
    const dependencies = {};
    const dependencySet = new Set<string>();
    const links = this.jointSVC.getLinks();

    for (const link of links) {
      const sourceCellName = link.getSourceElement().attr('.label/text');
      const targetCellName = link.getTargetElement().attr('.label/text');

      this.correctOutputTargetNode(link, sourceCellName, targetCellName); // could be somewhere else or outside.
      dependencySet.add(sourceCellName);

      if (dependencies[sourceCellName] === undefined) {
        dependencies[sourceCellName] = new Set();
      }

      dependencies[sourceCellName].add(targetCellName);
    }

    return this.createFinalDependencies(dependencies, dependencySet);
  }

  // iterates over the sourceNodes and pairs them up with their targets.
  createFinalDependencies(dependencies: object, dependencySet: Set<string>): Array<string> {
    const finaldeps = new Array<string>();
    for (const sourceName of Array.from(dependencySet)) {
      const depset = dependencies[sourceName];
      for (const dep of Array.from(depset)) {
        finaldeps.push('connection: [ *' + sourceName + ', *' + dep + ' ]');
      }
    }
    return finaldeps;
  }

  // delete displayName for those nodes which doesnt have a link
  // and delete the targetIP targetPort if not specified
  correctOutputsWithoutLink(): void {
    for (const node of this.occopusDescriptor.nodes) {
      for (const outport of node.variables.flowbster.app.out) {
        if (outport.displayName) {
          delete outport.displayName
        }
        if (!outport.targetip && !outport.targetport) {
          delete outport.targetip;
          delete outport.targetport
        }
      }
    }
  }

  // corrects the attributes of those outputs which have links attached to another node.
  // HINT : this is not needed if we get a proper linking event. (too hard)
  correctOutputTargetNode(link: joint.dia.Link, sourceCellName: string, targetCellName: string): void {

    const node: NodeDescriptor = this.occopusDescriptor.nodes.find(nodeEl => nodeEl.name === sourceCellName);
    const outputDescriptors: OutPutDescriptor[] = node.variables.flowbster.app.out;
    console.log(outputDescriptors);

    if (outputDescriptors) {
      for (let iii = 0; iii < outputDescriptors.length; iii++) {

        const outputDescriptor = outputDescriptors[iii];
        const sourcePortName = link.get('source').port;

        if (outputDescriptor.displayName !== sourcePortName) {
          continue;
        }

        delete outputDescriptor.targetip;
        delete outputDescriptor.targetport;
        delete outputDescriptor.displayName;

        const targetPortName = link.get('target').port;
        outputDescriptor.targetname = targetPortName;

        outputDescriptor.targetnode = targetCellName;
      }
    }
  }

  // gets every piece of the joint Nodes into a node description
  createDescriptorNodes(): NodeDescriptor[] {
    const cells: joint.dia.Cell[] = this.jointSVC.getCells();
    const nodeDescriptors: NodeDescriptor[] = [];

    if (cells) {
      for (const cell of cells) {
        if (cell.get('type') === 'link') {
          continue;
        }
        const nodeDescriptor: NodeDescriptor = this.createNodeDescriptor(cell);
        nodeDescriptors.push(nodeDescriptor);
      }
    } else {
      console.log('There are no cells to work with');
    }

    return nodeDescriptors;
  }

  // iterates through the parameter cells inputs and initializes an InputDescriptor Array.
  createInputs(cell: joint.dia.Cell): InputDescriptor[] {
    const inportNames = cell.get('inPorts');
    const inportDescriptors: InputDescriptor[] = [];

    if (inportNames.length) {

      const inportProperties = cell.get('inPortsProps');

      console.log(JSON.stringify(inportProperties));

      for (const inportName of inportNames) {
        inportDescriptors.push(this.createInput(inportName, inportProperties));
      }
    }

    return inportDescriptors;
  }

  // from the input name and the inputs properties initializes an InputDescriptor object.
  createInput(inportName: string, inportProperties: any): InputDescriptor {

    const inport: InputDescriptor = { name: inportName };

    const hasProperties = inportProperties[inportName]['isCollector']; // change this with the InputPort

    if (hasProperties) {
      inport.collector = hasProperties;
      inport.format = '\\' + inportProperties[inportName]['storagePattern'] + '\\'; // "" needed
    } else {
      console.log(`No properties in this given input port ${inportName}`);
    }

    return inport;
  }

  // from the output name and the output properties initializes an Outputdescriptor object.
  createOutput(outportName: string, outportProperties: any): OutPutDescriptor {

    const actualProperties = outportProperties[outportName];
    // console.log('MEEEEEEE');
    // console.log(actualProperties);


    if (!this.jointSVC.isEmpty(actualProperties)) {
      const outport: OutPutDescriptor = {
        name: actualProperties['fileName'],
        displayName: actualProperties['name'],
        targetip: actualProperties['targetIp'] === undefined ? this.jointSVC.workflow.collectorip : actualProperties['targetIp'],
        targetname: actualProperties['targetName'],
        targetport: actualProperties['targetPort'] === undefined ? this.jointSVC.workflow.collectorport : actualProperties['targetPort']
      };

      if (actualProperties.isGenerator) {
        outport.filter = '\\' + actualProperties['filterExpression'] + '\\'; // "" needed
        const distribution = actualProperties['distribution'];
        if (distribution) {
          outport.distribution = distribution;
        }
      }
      // console.log('OUTPORT');
      // console.log(outport);
      return outport;
    } else {
      console.log(`No properties in this given out port ${outportName}`);
      return null;
    }
  }

  // iterates through the parameter cells outputs and initializes an OutPutDescriptor Array.
  createOutputs(cell: joint.dia.Cell): OutPutDescriptor[] {

    const outportNames = cell.get('outPorts');
    // console.log('outportNames: ' + outportNames);
    const outportDescriptors: OutPutDescriptor[] = [];

    if (outportNames.length) {

      const outportProperties = cell.get('outPortsProps');

      // console.log('outportProps: ');
      // console.log(JSON.stringify(outportProperties));

      for (const outportName of outportNames) {
        const output = this.createOutput(outportName, outportProperties);
        if (output) {
          outportDescriptors.push(output);
        }
      }
      // console.log('OUTPUTDESCRIPTORS: ____');
      // console.log(outportDescriptors);
    }
    return outportDescriptors;
  }

  // createPorts(cell: joint.dia.Cell, portAttribute: string):InputDescriptor[] | OutPutDescriptor[] {
  //   let portNames = cell.get(portAttribute);
  //   let portDescriptors = [];

  //   if (portNames.length) {

  //     let portProperties = cell.get(portAttribute + 'Props');

  //     console.log(JSON.stringify(portProperties));

  //     for (let portName of portNames) {

  //       if (portAttribute === 'inPorts') {
  //         portDescriptors.push(this.createInput(portName, portProperties));
  //       } else if (portAttribute === 'outPorts') {
  //         portDescriptors.push(this.createOutput(portName, portProperties));
  //       }
  //     }
  //   }

  //   return portDescriptors;
  // }


  // initializes a valid YAML formatted NodeDescriptor.
  createNodeDescriptor(cell: joint.dia.Cell): NodeDescriptor {
    return {
      name: cell.attr('.label/text'),
      type: 'flowbster_node',
      scaling: {
        min: cell.attr('.scaling/min'),
        max: cell.attr('.scaling/max')
      },
      variables: {
        flowbster: {
          app: {
            exe: {
              filename: cell.attr('.exename/text'),
              tgzurl: cell.attr('.exetgz/text')
            },
            args: '\"' + cell.attr('.args/text') + '\"', // " " needed for jsyaml
            in: this.createInputs(cell),
            out: this.createOutputs(cell)
          }
        }
      }
    };
  }
}

