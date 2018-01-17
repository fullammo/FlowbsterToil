import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { JointService } from 'app/editor/flowbster-forms/shared/joint.service';

import { WorkflowEntry } from 'app/workflow/shared/workflowEntry';
import { WorkflowEntryService } from 'app/workflow/shared/workflow-entry.service';
import { DescriptorService } from 'app/editor/graph-interaction/shared/descriptor.service';

/**
 * Enables you to edit the actual workflow's properties or create a new one.
 */
@Component({
  selector: 'toil-workflow-detail',
  templateUrl: './workflow-detail.component.html',
  styleUrls: ['./workflow-detail.component.scss']
})
export class WorkflowDetailComponent implements OnInit, AfterViewInit {
  /**
   * The url data wether you want to create or edit a workflow.
   */
  operation: string;

  /**
   * A modifiable identity for input fields.
   */
  entry: WorkflowEntry;

  /**
   * Memory of the entry at the initializaton
   */
  starterEntry: WorkflowEntry;

  /**
   * A group of form controls regarding the workflow's edition.
   */
  workflowEditform: FormGroup;

  /**
   * Indicator about the graph's valid state.
   * A graph is valid when the main workflow properties are present.
   */
  isGraphValid = false;

  /**
   * Indicator about the changes made to the graph.
   */
  isGraphEdited = false;

  /**
   * Indicates if the form was submitted.
   */
  isSubmitted = false;

  /**
   * We initialize a clean modifiable entry to start with.
   */
  constructor(
    private jointSVC: JointService,
    private descriptorSVC: DescriptorService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private workflowEntrySVC: WorkflowEntryService
  ) {
    this.entry = { name: '', description: '', descriptor: '', graph: '' };
  }

  /**
   * We subscribe to the neccessary Observables regarding the change of the entry, and initialize the controls.
   */
  ngOnInit() {
    this.subscribeToEditorEditionChanges();
    this.subscribeToGraphValidationChanges();
    this.workflowEditform = this.initForm();
    this.subscribeToOperationChanges();
    this.subscribeToEntryChanges();
  }

  /**
   * Listens on workflow main property changes and sets our indicator for it.
   */
  private subscribeToGraphValidationChanges() {
    this.jointSVC.isWorkflowInitialized.subscribe(isGraphValid => {
      this.isGraphValid = isGraphValid;
    });
  }

  /**
   * Informs us whenever the Paper's data model is edited. Sets the associated indicator.
   */
  private subscribeToEditorEditionChanges() {
    this.jointSVC.workflowChange.subscribe(() => {
      this.isGraphEdited = true;
    });
  }

  /**
   * Sets the editable entry and its backup whenever there are changes made to the route's resolved data.
   */
  private subscribeToEntryChanges() {
    this.route.data.subscribe((data: { detail: WorkflowEntry }) => {
      this.entry = data.detail;
      this.starterEntry = this.workflowEntrySVC.initEntry(data.detail); // lawl
      console.log(this.entry);
    });
  }

  /**
   * Sets the operation whenever changes made to the route's parameters.
   */
  private subscribeToOperationChanges(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.operation = params.get('operation');
      console.log(this.operation);
    });
  }

  /**
   * If we are on the edit page, and there is a useful graph, we are going to show it on the paper.
   * (After the view is rendered, the paper component can set the JoitnService's properties.)
   */
  ngAfterViewInit() {
    if (this.operation === 'edit' && this.entry.graph) {
      this.jointSVC.uploadGraph(JSON.parse(this.entry.graph));
    }
  }

  /**
   * Initializes the necessary controls with optional Validators.
   */
  initForm() {
    return this.fb.group({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  /**
   * Navigates us back to the maintenance page.
   */
  onBack() {
    this.router.navigate(['/authenticated/workflow-man']);
  }

  /**
   * Updates the editable entries properties, Sets the submission indicator,
   * Based on the operation it corrects the database. Then navigates back to the maintenance page.
   */
  onSubmit() {
    this.entry.descriptor = this.descriptorSVC.getYamlDescriptor();
    this.isSubmitted = true;
    this.entry.graph = this.jointSVC.getGraphJSON();
    if (this.operation === 'create') {
      this.workflowEntrySVC.updateEntry(this.entry);
    } else if (this.operation === 'edit') {
      console.log(this.entry);
      this.workflowEntrySVC.updateEntry(this.entry);
    }

    this.router.navigate(['/authenticated/workflow-man']);
  }
}
