import { InfraInfo } from './infraInfo';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'toil-infra-details',
  templateUrl: './infra-details.component.html',
  styleUrls: ['./infra-details.component.scss']
})
export class InfraDetailsComponent implements OnInit {
  @Input() infraCollection: InfraInfo[];

  constructor() {}

  ngOnInit() {}
}
