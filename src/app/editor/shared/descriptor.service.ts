import { OutputPort } from './../models/outputPort';
import { InputPort } from './../models/inputPort';
import { Injectable } from '@angular/core';
import { OccopusDescriptor } from 'app/editor/models/occopusDescriptor';
import { JointService } from 'app/editor/shared/joint.service';
import { Workflow } from 'app/editor/models/workflow';
import { NodeDescriptor } from 'app/editor/models/nodeDescriptor';

import * as jsyaml from 'js-yaml';


/**
 * A service to create a fully understandable YAML formatted description to Occopus.
 * This service uses {@link JointService} to get the paper's model data to generate the YAML string.
 */
@Injectable()
export class DescriptorService {

  /**
   * Holder of descriptor data.
   */
  occopusDescriptor: OccopusDescriptor;

  /**
   * We inject the needed services and initialize a basic descriptor.
   */
  constructor(private jointSVC: JointService) { this.occopusDescriptor = this.initOccopusDescriptor() }

  /**
   * Sets the occopus descriptors neccessary properties.
   * @param newWorkflow Workflow form data.
   */
  updateDescriptorProperties(newWorkflow: Workflow) {
    this.occopusDescriptor.user_id = newWorkflow.userid;
    this.occopusDescriptor.infra_name = newWorkflow.infraname;
    // this.occopusDescriptor.infra_id = newWorkflow.infraid;
    this.occopusDescriptor.variables.flowbster_global.collector_ip = '&collectorip ' + newWorkflow.collectorip;
    this.occopusDescriptor.variables.flowbster_global.collector_port = '&collectorport ' + newWorkflow.collectorport;
    this.occopusDescriptor.variables.flowbster_global.receiver_port = '&receiverport ' + newWorkflow.receiverport;
  }

  /**
   * Initialize a clean Occopus Descriptor.
   */
  initOccopusDescriptor(): OccopusDescriptor {
    return {
      user_id: '',
      // infra_id: null,
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

  /**
   * Creates a YAML-formatted string from the actual papers data model as occopusDescriptor.
   */
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

  /**
   * Download the Yaml Description (could be placed in a utility service).
   * @param fileName The name with the extension how the Descriptor is going to be saved.
   * @param mimeType The given mimeType neccessary for the linking.
   */

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

  /**
   * Updates the Occopus Descriptors nodes and dependencies.
   */
  updateOccopusDescriptor() {
    this.occopusDescriptor.nodes = this.createDescriptorNodes();
    this.occopusDescriptor.dependencies = this.handleDependencies();
  }

  /**
   * Changes the names to be variables in proper yaml format.
   * @returns The valid Yaml string represantation from the Occopus Descriptor.
   */
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

  /**
   * Corrects the outputs by the given dependencies and creates an array frmo the node dependency chain.
   */
   // HINT: not neccessary to correct the outputs if we can do it on a higher level, maybe in the modal. not sure yet.
  handleDependencies(): Array<string> {
    const dependencies = {};
    const dependencySet = new Set<string>();
    const links = this.jointSVC.getLinks();

    for (const link of links) {
      const sourceCellName = link.getSourceElement().attr('.label/text');
      const targetCellName = link.getTargetElement().attr('.label/text');

      this.correctOutputTargetNode(link, sourceCellName, targetCellName); // could be somewhere else or outside.
      this.correctOutputsWithoutLink();
      dependencySet.add(sourceCellName);

      if (dependencies[sourceCellName] === undefined) {
        dependencies[sourceCellName] = new Set();
      }

      dependencies[sourceCellName].add(targetCellName);
    }

    return this.createFinalDependencies(dependencies, dependencySet);
  }

  // iterates over the sourceNodes and pairs them up with their targets.
  /**
   * Iterates over the sourceNodes and pairs them up with their targets.
   * @param dependencies An object of every dependency sets.
   * @param dependencySet Dependency pairs
   */
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

  /**
   * Deletes the display name for those nodes which doesnt have a link and also deletes the targetIP and targetPort if its not specified
   */
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

  /**
   * Corrects the attributes of those outputs which have links attached to another node.
   * @param link The link to be investigated.
   * @param sourceCellName The Source cells name.
   * @param targetCellName The Target cells name.
   */
  correctOutputTargetNode(link: joint.dia.Link, sourceCellName: string, targetCellName: string): void {

    const node: NodeDescriptor = this.occopusDescriptor.nodes.find(nodeEl => nodeEl.name === sourceCellName);
    const outputDescriptors: OutputPort[] = node.variables.flowbster.app.out;
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
  /**
   * Gets every cell which is not a link from the papers model into a collection of node Descriptors.
   * @returns A collection of YAML formatted node descriptors.
   */
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

  /**
   * Iterates through the parameter cells inputs and initializes an InputDescriptor Array.
   * @param cell The actual Node's cell.
   * @returns A collection of YAML formatted InputDescriptors
   */
    // HINT : COULD BE ERASED BY SPEFICING.
  createInputs(cell: joint.dia.Cell): InputPort[] {
    const inportNames = cell.get('inPorts');
    const inportDescriptors: InputPort[] = [];

    if (inportNames.length) {

      const inportProperties = cell.get('inPortsProps');

      console.log(JSON.stringify(inportProperties));

      for (const inportName of inportNames) {
        inportDescriptors.push(this.createInput(inportName, inportProperties));
      }
    }

    return inportDescriptors;
  }

  /**
   * From the input name and its properties initializes a YAML formatted InputDescriptor entity.
   * @param inportName The name of the input port.
   * @param inportProperties The properties of that input.
   * @returns An Occopus capable formatted InputDescriptor
   */
  createInput(inportName: string, inportProperties: any): InputPort {

    const inport: InputPort = { name: inportName };

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
  /**
   * From the name and properties initializes a YAML formatted OutputDescriptor object.
   * @param outportName The output port's name.
   * @param outportProperties  The output port's properties.
   * @returns An Occopus capable formatted OutputDescriptor
   */
  createOutput(outportName: string, outportProperties: any): OutputPort {

    const actualProperties = outportProperties[outportName];
    // console.log('MEEEEEEE');
    // console.log(actualProperties);


    if (!this.jointSVC.isEmpty(actualProperties)) {
      const outport: OutputPort = {
        name: actualProperties['name'],
        displayName: actualProperties['displayName'],
        targetip: actualProperties['targetip'] === undefined ? this.jointSVC.workflow.collectorip : actualProperties['targetip'],
        targetname: actualProperties['targetname'],
        targetport: actualProperties['targetport'] === undefined ? this.jointSVC.workflow.collectorport : actualProperties['targetport']
      };

      if (actualProperties.isGenerator) {
        outport.filter = '\\' + actualProperties['filter'] + '\\'; // "" needed
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

  /**
   * Iterates through the paramater cells outputs and formats and initializes an OutPutDescriptor Array.
   * @param cell The actual Node's cell.
   * @returns A collection of Occopus capable YAML formatted OutputDescriptors.
   */
  createOutputs(cell: joint.dia.Cell): OutputPort[] {

    const outportNames = cell.get('outPorts');
    // console.log('outportNames: ' + outportNames);
    const outportDescriptors: OutputPort[] = [];

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

  /**
   * Initializes a valid YAML formatted NodeDescriptor object.
   * @param cell The Actual node's cell.
   */
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

