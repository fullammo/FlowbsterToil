import { Component, OnInit } from '@angular/core';
import { OccoService } from 'app/workflow/shared/occo.service';

@Component({
  selector: 'toil-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {
  url: string;

  constructor(private occoSVC: OccoService) {}

  ngOnInit() {}

  onClick() {
    this.occoSVC.url = this.url;
    console.log(this.occoSVC.url);
  }
}
