import { WorkflowEntry } from 'app/view-models/workflowEntry';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { JointService } from 'app/editor/shared/joint.service';
import { DescriptorService } from 'app/editor/shared/descriptor.service';
import { WorkflowEntryService } from 'app/services/workflow-entry.service';

@Component({
  selector: 'toil-workflow-detail',
  templateUrl: './workflow-detail.component.html',
  styleUrls: ['./workflow-detail.component.scss']
})
export class WorkflowDetailComponent implements OnInit, AfterViewInit {

  operation: string;
  isGraphValid = false;
  entry: WorkflowEntry;
  userform: FormGroup;

  constructor(private jointSVC: JointService,
    private descriptorSVC: DescriptorService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private workflowEntrySVC: WorkflowEntryService) {
    this.entry = { name: '', description: '', descriptor: '', graph: '' };
  }

  ngOnInit() {
    this.jointSVC.isWorkflowInitialized.subscribe(isGraphValid => {
      this.isGraphValid = isGraphValid;
    });
    this.userform = this.initForm();
    this.initComponent();
  }

  ngAfterViewInit() {
    if (this.operation === 'edit' && this.entry.graph) {
      this.jointSVC.uploadGraph(JSON.parse(this.entry.graph));
    }
  }

  initForm() {
    return this.fb.group({
      'name': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required),
    });
  }


  // subscribing to the URL changes and changes by changing values.
  // gotta call a subject to initialize the upload.
  private initComponent() {
    this.route.paramMap.subscribe(params => {
      console.log('called', params);
      this.operation = params.get('operation');
      if (this.operation === 'edit') {
        this.workflowEntrySVC.getEntry(params.get('id')).subscribe(entries => {
          entries.forEach(entry => {
            if (entry.$key === params.get('id')) {
              console.log(entry);
              this.entry = entry;
            }
          })
        })
      }
    });
    // this.entry = this.workflowEntrySVC.getEntry(this.route.snapshot.params['id']);
    // this.operation = this.route.snapshot.params['operation'];
  }

  onBack() {
    this.router.navigate(['/authenticated/workflow-maint']);
  }

  onSubmit() {
    this.entry.descriptor = this.descriptorSVC.getYamlDescriptor();
    this.entry.graph = this.jointSVC.getGraphJSON();
    if (this.operation === 'create') {
      this.workflowEntrySVC.saveEntry(this.entry);
    } else if (this.operation === 'edit') {
      console.log(this.entry);
      this.workflowEntrySVC.updateEntry(this.entry);
    }

    this.router.navigate(['/authenticated/workflow-maint']);
  }
}
