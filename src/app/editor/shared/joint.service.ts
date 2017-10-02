
import { element } from 'protractor';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { OutputPort } from 'app/editor/models/outputPort';
import { InputPort } from 'app/editor/models/inputPort';
import { FlowbsterNode } from 'app/editor/models/flowbsterNode';
import { Workflow } from 'app/editor/models/workflow';
import { DescriptorService } from 'app/editor/shared/descriptor.service';

import 'app/editor/models/customArrayFeatures';

import * as joint from 'jointjs';
import * as _ from 'lodash';

@Injectable()
export class JointService {

  selectedCellView: joint.dia.CellView;
  selectedPortName: string;
  selectedPortType: string;

  workflow: Workflow;
  graph = new joint.dia.Graph;
  paper: joint.dia.Paper;

  actualNodePlacement: { x: number, y: number };
  actualNode: FlowbsterNode
  actualNodeRect: joint.shapes.devs.Model;

  actualPort: InputPort | OutputPort;

  isExistingNodeSubject: Subject<boolean>;
  workflowChange: Subject<void>;
  isWorkflowInitialized: Subject<boolean>

  self = this;

  // BONUS:  message events from proper linking and port creations and updates, and even nodes.
  // BONUS: on cancellation we reset the form again. a confirmation dialog.
  // BONUS: highlighting selected port.
  // BONUS: it would be nice to revert a change.
  // BONUS: confirm dialog for confirming the deletion of a given node.
  // BONUS: emit information to the main page. maybe if we want more sticky message
  // BONUS: with PrimeNG Upload we can upload more things at once, maybe create a template "NODE" of them.
  // BONUS: rename everything to match the descriptors.
  // BONUS: Clear paper function would be awesome.
  // BONUS: if we put a tick in the checkboxes the connected content is getting up.

  // BEHAVIOUR(ok): click upload somewhat gets the nativeElement undefined.
  // HINT: Wait for PrimeNG-s new release. its going to work. there is already a fix for this.
  // check primefaces github issue @3664

  // BEHAVIOUR(ok): If there is a port which hasnt got any properties its going to be delisted from the yaml description.
  // i think this is the exact behaviour we want.

  // BEHAVIOUR(ok): if Collector checkbox is disabled and something was entered then its gonna be irrelevant and deleted.
  // i think this is an OK behaviour.

  // BEHAVIOUR: My custom validators are going to subscribe everytime you click on them. cant really make it unsubscribe.

  // BEHAVIOUR: The "update dialog" will not clone the existing node if the name is changed in the meantime. can generate same names.

  // BEHAVIOUR: if you click out of the modal without submission, you wont have the visual things (the form) reset.
  // HINT: change this with md modal. or find a way to get to the canceling event.

  // REFACTOR: downloadGraph and some functions could be placed in a Utility file.
  // REFACTOR: stringlike attributes should be placed in a configuration file like (.label/text, inPortProps) in constants.
  // REFACTOR: Maybe rename JointService to GraphService and get a JointService for the helper and other operations.
  // REFACTOR: Get the exact location from the 3rd party components to reduce file size.

  // TODO: We need to have Id's for such operations on in/out , to change their name as well.
  // TODO: Get the site ready with firebase backend.
  // TODO: Mulitple linking support and convert it to yaml.
  // TODO: Change to PrimeNG-s Menubar. we need custom menuitems.
  // TODO: Refactor (downloadGraph and some functions could be in a UtilityService)
  // TODO: Testing

  // neccessary to initialize these actual elements before any association happens
  constructor() {
    this.actualNode = this.initNode();
    this.actualPort = this.initPort('out');
    this.workflow = this.initWorkflow();
    this.isExistingNodeSubject = new Subject();
    this.isWorkflowInitialized = new Subject();
    this.workflowChange = new Subject<void>();
  }

  // returns an observable with the information of the updated node
  isUpdateNodeNameUniqueObservable(nodeName: string): Observable<boolean> {
    return new Observable(observer => {
      console.log('validate against updated nodes and workflowName');
      const element = this.getFlowbsterNodeElement(nodeName);
      if (element) {
        if (element.id === this.selectedCellView.model.id) {
          observer.next(true);
        } else {
          observer.next(false);
        }
      } else if (this.isWorkflowName(nodeName)) {
        observer.next(false);
      } else {
        observer.next(true);
      }
    });
  }

  private isWorkflowName(name: string): boolean {
    return this.graph.get('wf_name') === name;
  }

  // returns an observable with the information if the nodeName is unique
  isNodeNameUniqueObservable(nodeName: string): Observable<boolean> {

    return new Observable(observer => {
      console.log('validate against nodes and workflowName');
      const element = this.getFlowbsterNodeElement(nodeName);
      if (element || this.isWorkflowName(nodeName)) {
        observer.next(false);
      } else {
        observer.next(true);
      }
    });
  }

  //
  isWorkflowNameUniqueObservable(workflowName: string): Observable<boolean> {
    return new Observable(observer => {
      console.log('validate against nodes');
      const element = this.getFlowbsterNodeElement(workflowName);
      if (element) {
        observer.next(false);
      } else {
        observer.next(true);
      }
    });
  }

  clearGraph(): void {
    this.graph.clear();
  }

  getNodeNames(): string[] {
    console.log(this.graph.getElements().map(element => element.attr('.label/text')));
    return this.graph.getElements().map(element => element.attr('.label/text'));
  }

  reinitializeWorkflow() {
    this.workflow = this.initWorkflow();
  }

  initWorkflow(): Workflow {
    return {
      infraid: null,
      userid: '',
      infraname: '',
      collectorip: null,
      collectorport: null,
      receiverport: null,
    };
  }

  // associates the workflow properties to the graph.
  updateWorkflowProperties(newWorkflow: Workflow) {
    this.workflow = newWorkflow;
    this.graph.set('infra_id', newWorkflow.infraid);
    this.graph.set('user_id', newWorkflow.userid);
    this.graph.set('wf_name', newWorkflow.infraname);
    this.graph.set('coll_ip', newWorkflow.collectorip);
    this.graph.set('coll_port', newWorkflow.collectorport);
    this.graph.set('recv_port', newWorkflow.receiverport);
    this.isWorkflowInitialized.next(true);
    this.emitWorkflowChange();
  }

  // creates a link and attaches it to the DOM and downloads graph json content, after that immidietaly removes it from the DOM
  downloadGraph(fileName: string, mimeType: string): void {
    if (this.graph) {

      const elHtml = JSON.stringify(this.getDownloadableGraph());
      const link = document.createElement('a');
      mimeType = mimeType || 'text/plain';

      link.setAttribute('download', fileName);
      link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } else {
      console.log('Graph is not present');
    }

  }

  private getWorkflowAttributes(): Workflow {
    return {
      infraid: this.graph.get('infra_id'),
      infraname: this.graph.get('wf_name'),
      userid: this.graph.get('user_id'),
      collectorip: this.graph.get('coll_ip'),
      collectorport: this.graph.get('coll_port'),
      receiverport: this.graph.get('recv_port')
    };
  }

  // unhighlights the actual element to return a proper formatted graphJson and then highlights it again.
  private getDownloadableGraph(): string {
    let downloadableGraph = this.graph.toJSON();

    if (this.selectedCellView) {
      this.unhighlightCellView(this.selectedCellView);
      downloadableGraph = this.graph.toJSON();
      this.highlightCellView(this.selectedCellView);
    }

    return downloadableGraph;
  }

  private unhighlightCellView(cellView: joint.dia.CellView): void {
    cellView.model.attr('rect/stroke', 'black');
    cellView.model.attr('rect/stroke-width', '1px');
  }

  private highlightCellView(cellView: joint.dia.CellView): void {
    cellView.model.attr('rect/stroke', 'red');
    cellView.model.attr('rect/stroke-width', '5px');
  }

  getGraphJSON(): string {
    let graphJSON = JSON.stringify(this.graph.toJSON());

    if (this.selectedCellView) {
      this.unhighlightCellView(this.selectedCellView);
      graphJSON = JSON.stringify(this.graph.toJSON());
      this.highlightCellView(this.selectedCellView);
    }

    return graphJSON;
  }

  // return the graphs cells.
  getCells(): joint.dia.Cell[] {
    return this.graph.getCells();
  }

  // reutrns the associated links to the graph.
  getLinks(): joint.dia.Link[] {
    return this.graph.getLinks();
  }

  // initializes a graph from a given JSON formatted Graph.
  uploadGraph(graphJson: string): void {
    this.stopListeningOnGraphChange(); // when you upload you are getting an extra warning.
    this.graph.fromJSON(graphJson);
    this.listenOnGraphChange();
    this.workflow = this.getWorkflowAttributes();
  }

  // sets the scaling of the paper by the given level.
  reScalePaper(newLevel: number): void {
    if (this.paper) {
      const newScale = newLevel / 100;
      this.paper.scale(newScale, newScale);
    }
  }

  // create a new flowbster node with unique name on the paper. Informs the user if it was done.
  createNode(flowbsterNode: FlowbsterNode): boolean {

    const existingNodeElement: joint.dia.Element = this.getFlowbsterNodeElement(flowbsterNode.name);

    if (!existingNodeElement && this.actualNodePlacement.x && this.actualNodePlacement.y) {

      const rect = this.initNodeModel(flowbsterNode, this.actualNodePlacement.x, this.actualNodePlacement.y);
      this.graph.addCell(rect);
      this.emitWorkflowChange();
      return true;
    }
    return false;
  }

  // WARNING: here we violate our rule for duplicate nodeName
  cloneNode(flowbsterNode: FlowbsterNode): boolean {

    this.unhighlightCellView(this.selectedCellView);

    const existingNodeElement = this.getFlowbsterNodeElement(flowbsterNode.name);

    if (existingNodeElement) {

      const clonedElement =
        (existingNodeElement.clone() as joint.dia.Element).translate(20, 0).attr('.label/text', flowbsterNode.name + 'CLONE');

      this.graph.addCell(clonedElement);
      this.highlightCellView(this.selectedCellView);
      this.emitWorkflowChange();
      return true;
    }
    return false;
  }

  // updates the selectedNodes model.
  updateNode(flowbsterNode: FlowbsterNode): boolean {

    // const existingNodeElement: joint.dia.Element = this.getFlowbsterNodeElement(flowbsterNode.name);

    // if (!existingNodeElement) {
    this.selectedCellView.model.attr('.label/text', flowbsterNode.name);
    this.selectedCellView.model.attr('.exename/text', flowbsterNode.execname);
    this.selectedCellView.model.attr('.args/text', flowbsterNode.args);
    this.selectedCellView.model.attr('.exetgz/text', flowbsterNode.execurl);
    this.selectedCellView.model.attr('.scaling/min', flowbsterNode.scalingmin);
    this.selectedCellView.model.attr('.scaling/max', flowbsterNode.scalingmax);
    this.emitWorkflowChange();
    return true;
    // }

    // return false;
  }

  // if there is a selected Node then its going to be removed.
  deleteNode(): void {
    if (this.selectedCellView) {
      this.selectedCellView.model.remove();
      this.selectedCellView = null;
      this.emitWorkflowChange();
    } else {
      console.log('no selected node present to remove');
    }
  }

  // updates the attributes of the selected port. sets the model and triggers the visual appearance
  updatePort(portAttributes: InputPort | OutputPort, isInput: boolean): boolean {

    const oldName = this.selectedPortName;
    const newName = portAttributes.name;
    const modelAttribute = isInput ? 'inPortsProps' : 'outPortsProps';
    let portProps = this.selectedCellView.model.get(modelAttribute);

    if (oldName !== newName) {
      const handledInportsProps = this.handlePortNameChange(oldName, newName, portProps, isInput);
      if (handledInportsProps === null) {
        return false;
      } else {
        portProps = handledInportsProps;
      }
    }

    portProps[newName] = portAttributes;
    this.selectedCellView.model.set(modelAttribute, portProps);
    this.emitWorkflowChange();
    return true;
  }



  // creates a new entry in our Property holder object and deletes the old one. triggers the visual representation.
  private handlePortNameChange(oldName: string, newName: string, portProps: InputPort[] | OutputPort[], isInput: boolean)
    : InputPort[] | OutputPort[] {
    const portType = isInput ? 'inPorts' : 'outPorts';
    const ports = this.selectedCellView.model.get(portType);
    let foundPortIdx = -1;

    for (let i = 0; i < ports.length; i++) {
      if (ports[i] === newName) {
        alert('The port name set already exists!'); // some better error handling here. or miss this if we have the validation.
        return null;
      }
      if (ports[i] === oldName) {
        foundPortIdx = i;
      }

    }

    portProps[oldName] = undefined;

    if (foundPortIdx !== -1) {
      ports[foundPortIdx] = newName;
    }

    this.selectedCellView.model.set(portType, ports);
    this.selectedCellView.model.trigger('change:' + portType);
    this.graph.trigger('change');
    return portProps;
  }

  // Creates a new port with the given type and initializes its attributes on the cellview model.
  addPort(type: string): void {
    if (this.selectedCellView) {

      let ports = this.selectedCellView.model.get(type);

      if (ports === null) {
        ports = [type + ''];
      } else {
        ports.push(type + ports.length);
      }

      const portName = ports[ports.length - 1];
      const portGroup = (type === 'inPorts' ? 'inPortsProps' : 'outPortsProps');
      const portsProps = this.selectedCellView.model.get(portGroup);
      portsProps[portName] = {};

      this.selectedCellView.model.set(portGroup, portsProps);
      this.selectedCellView.model.set(type, ports);
      this.selectedCellView.model.trigger('change:' + type);
      this.graph.trigger('change');
      this.emitWorkflowChange();
    } else {
      console.log('select a cell first'); // we need better error handling
    }
  }

  private emitWorkflowChange(): void {
    this.workflowChange.next();
  }

  // deletes the selected port.
  deletePort(): void {
    if (this.selectedCellView && this.selectedPortType) {
      const portType = (this.selectedPortType === 'out' ? 'outPorts' : 'inPorts');
      const ports = this.selectedCellView.model.get(portType);
      ports.remove(this.selectedPortName); // remove functiont valahogy ideeröltetni. és egy error handling az elejére.
      this.selectedCellView.model.set(portType, ports);
      this.selectedCellView.model.trigger('change:' + portType);
      this.emitWorkflowChange();
    } else {
      console.log('select a port first'); // we need better error handling.
    }

  }

  // initializes a flowbsterNode from the start
  private initNode(): FlowbsterNode {
    return {
      args: '',
      name: '',
      execname: '',
      execurl: '',
      scalingmax: 1,
      scalingmin: 1
    }
  }

  // initializes the rect on the paper from the flowbsternode attributes and the positions.
  initNodeModel(flowbsterNode: FlowbsterNode, x: number, y: number): joint.shapes.devs.Model {
    return new joint.shapes.devs.Model({
      position: { x, y },
      size: { width: 100, height: 100 },
      inPorts: [],
      outPorts: [],
      inPortsProps: {},
      outPortsProps: {},
      ports: {
        groups: {
          'in': {
            attrs: {
              '.port-body': {
                fill: '#16A085',
                magnet: 'passive'
              } // here we could enter the inPortProps attributes
            }
          },
          'out': {
            attrs: {
              '.port-body': {
                fill: '#E74C3C'
              } // here we could enter the outPortProps attributes
            }
          }
        }
      },
      attrs: {
        '.label': { text: flowbsterNode.name },
        '.exename': { text: flowbsterNode.execname },
        '.args': { text: flowbsterNode.args },
        '.exetgz': { text: flowbsterNode.execurl },
        '.scaling': { min: flowbsterNode.scalingmin, max: flowbsterNode.scalingmax },
        rect: { fill: 'green' },
        text: { fill: '#f4f4f4' }
      }
    });
  }

  // from the given DOM element we initialize the papers default attributes.
  initPaper(domElement: JQuery, readOnly: boolean): void {
    const self = this;

    this.paper = new joint.dia.Paper({
      el: domElement,
      width: domElement.width(),
      height: domElement.height(),
      gridSize: 5,
      model: this.graph,
      linkPinning: false,
      interactive: !readOnly,
      defaultLink: new joint.dia.Link({
        attrs: {
          '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }
        }
      }),
      validateConnection: this.isConnectionValid,
      validateMagnet: function (cellView, magnet) {
        const links = self.getLinks();
        for (let i = 0; i < links.length; i++) {
          if (((cellView.model.id === links[i].get('source').id) && (magnet.getAttribute('port') === links[i].get('source').port)) ||
            ((cellView.model.id === links[i].get('target').id) && (magnet.getAttribute('port') === links[i].get('target').port))) {
            return false;
          }
        }
        return magnet.getAttribute('magnet') !== 'passive';
      },
      snapLinks: { radius: 75 },
      markAvailable: true
    });
  }

  // checks wether the actual link is unique and going from an input to an output.
  private isConnectionValid(cellViewS, magnetS, cellViewT, magnetT, end, linkView): boolean {
    if (magnetS && magnetS.getAttribute('port-group') === 'in') {
      return false;
    }
    if (cellViewS === cellViewT) {
      return false;
    }

    return magnetT && magnetT.getAttribute('port-group') === 'in';
  }

  // checks if the flowbsterNodes name is unique and returns the actual element.
  getFlowbsterNodeElement(name: string): joint.dia.Element {
    const elements: joint.dia.Element[] = this.graph.getElements();
    for (const element of elements) {
      if (element.attr('.label/text') === name) {
        return element;
      }
    }
    return null;
  }

  // ensures we are listening on all events from the paper
  logAllEventsOnPaper() {
    this.paper.on('all', function (event, cell) {
      console.log(arguments);
    });
  }

  logAllEventsOnGraph() {
    this.graph.on('all', function (event, cell) {
      console.log(arguments);
    })
  }

  // its going to subscribe for the blank click event
  // initializes the placement properties,reinitialize newNodeAttributes and toggles the callers attribute.
  listenOnBlankClick(listener: any, modalTriggerAttribute: string): void {
    const self = this;

    // we are going to catch the x,y information from this event to get it ready on the paper.
    this.paper.on('blank:pointerclick', function (event, x, y) {
      self.initPlacement(x, y);
      listener[modalTriggerAttribute] = true;
      self.isExistingNodeSubject.next(false);
      self.actualNode = self.initNode();
    });
  }

  listenOnGraphChange() {
    const self = this;

    this.graph.on('change', function (cell: joint.dia.Cell) {
      console.log(this);
      self.emitWorkflowChange();
    });
  }

  stopListeningOnGraphChange() {
    this.graph.off('change');
  }



  // listens on the pointerup event and fires up the proper modal of i/o ports.
  listenOnPointerUp(listener: any, inputAttributeName: string, outputAttributeName: string, readOnly: boolean): void {
    const self = this;

    this.paper.on('cell:pointerup', function (cellView, event, x, y) {
      const portName = event.target.getAttribute('port');
      if (portName !== null) {
        // save these from the event to the service
        self.selectedPortName = portName;
        self.selectedPortType = event.target.getAttribute('port-group'); // not sure if i need this in the service,maybe a local is enough

        if ('out' === self.selectedPortType) {
          if (cellView.sourceView) {
            self.selectCellView(cellView.sourceView, readOnly); // if the source view exists we need to select that cellview.
          }
          self.setPort(cellView, 'outPortsProps');
          listener[outputAttributeName] = true; // trigger output modal.

        } else if ('in' === self.selectedPortType) {

          self.setPort(cellView, 'inPortsProps');
          listener[inputAttributeName] = true; // trigger input modal.
        }

        console.log(self.selectedPortName + ' ' + self.selectedPortType);
        console.log(self.actualPort);
      }
    });
  }

  // gets the attributes from the cellview and sets the actual service port wether its an input or an output port
  setPort(cellView, attributeName: string) {

    const portAttributes = this.setPortAttributes(cellView, attributeName);

    if (undefined !== portAttributes && this.isEmpty(portAttributes)) {

      if (attributeName === 'inPortsProps') {
        console.log('setting input');
        this.actualPort = this.initPort('in');
      } else if (attributeName === 'outPortsProps') {
        this.actualPort = this.initPort('out');
        console.log('setting output');
      }
    } else {
      console.log('getting the same guy');
      this.actualPort = portAttributes;
    }
  }

  // sets the port Attributes by the given attributeName (in and output model difers)
  setPortAttributes(cellView, attributeName: string) {
    if (attributeName === 'inPortsProps') {
      return cellView.model.get(attributeName)[this.selectedPortName];
    }
    if (cellView.sourceView) {
      return cellView.sourceView.model.get(attributeName)[this.selectedPortName];
    } else {
      return cellView.model.get(attributeName)[this.selectedPortName];
    }
  }

  isEmpty(object: Object): boolean {
    return Object.keys(object).length === 0 && object.constructor === Object;
  }

  // returns a fresh port by the given type
  private initPort(type: string): InputPort | OutputPort {

    if (type === 'in') {
      return this.initInputPort();
    }

    return this.initOutputPort();
  }

  // initializes an input port
  private initInputPort(): InputPort {
    return {
      name: this.selectedPortName,
      isCollector: false,
      storagePattern: ''
    };
  }

  // initializes an output port
  private initOutputPort(): OutputPort {
    return {
      name: this.selectedPortName,
      fileName: '',
      targetName: '',
      targetIp: '',
      targetPort: '',
      isGenerator: false,
      filterExpression: '',
      distributionType: null
    };
  }

  // listens on the pointerclick event and selects the actual cell
  listenOnCellClick(readOnly: boolean): void {
    const self = this;
    this.paper.on('cell:pointerclick', function (cellView, event, x, y) {
      self.selectCellView(cellView, readOnly);
    });
  }

  // listens on the double click event and updates the newNode's attributes.
  listenOnCellDoubleClick(listener: any, modalTriggerAttribute: string): void {
    const self = this;
    this.paper.on('cell:pointerdblclick', function (cellView, event, x, y) {
      self.actualNode = {
        name: self.getSelectedJobsProperty('label', false),
        execname: self.getSelectedJobsProperty('exename', false),
        args: self.getSelectedJobsProperty('args', false),
        execurl: self.getSelectedJobsProperty('exetgz', false),
        scalingmin: +self.getSelectedJobsProperty('min', true),
        scalingmax: +self.getSelectedJobsProperty('max', true)
      };
      listener[modalTriggerAttribute] = true;
      self.isExistingNodeSubject.next(true);
      console.log(self.actualNode);
    });
  }

  // if there is a new cell its going to highlight it.
  private selectCellView(cellView: joint.dia.CellView, readOnly: boolean): void {
    if (cellView !== this.selectedCellView) {
      if (this.selectedCellView != null && !readOnly) {
        this.unhighlightCellView(this.selectedCellView);
      }
      if (cellView.model !== undefined) {
        this.selectedCellView = cellView;
        if (!readOnly) {
          this.highlightCellView(this.selectedCellView);
        }
      }
    }
  }

  // initializes the placement of the new node.
  private initPlacement(x: number, y: number): void {
    this.actualNodePlacement = { x, y };
  }

  // get data from the selected Cell by the attribute name and by if its a scale prop or not.
  private getSelectedJobsProperty(name: string, isScale: boolean): string {

    if (!this.selectedCellView) {
      return '';
    }

    if (!isScale) {
      return this.selectedCellView.model.attr('.' + name + '/text');
    }

    return this.selectedCellView.model.attr('.scaling/' + name);
  }
}

