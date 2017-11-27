import { Component, OnInit } from '@angular/core';
import { DeploymentService } from 'app/workflow/shared/deployment.service';

@Component({
  selector: 'toil-deployment-manager',
  templateUrl: './deployment-manager.component.html',
  styleUrls: ['./deployment-manager.component.scss'],
  providers: [DeploymentService]
})
export class DeploymentManagerComponent implements OnInit {

  constructor() {}

  ngOnInit() {}
}
