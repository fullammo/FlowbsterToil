import { WorkflowEntry } from './../shared/workflowEntry';
import { Component, OnInit, Input } from '@angular/core';
import { DeploymentService } from 'app/workflow/shared/deployment.service';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'toil-deployment-manager',
  templateUrl: './deployment-manager.component.html',
  styleUrls: ['./deployment-manager.component.scss'],
  providers: [DeploymentService]
})
export class DeploymentManagerComponent implements OnInit, AfterViewInit {
  @Input() contextEntry: WorkflowEntry;

  constructor(private deploymentSVC: DeploymentService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    console.log(this.contextEntry);
    this.deploymentSVC.subscribeToDataChanges(this.contextEntry.$key);
    console.log(this.deploymentSVC.collection);
  }
}
