import { Component } from '@angular/core';
import { OccoService } from 'app/workflow/shared/occo.service';

/**
 * Renders the view to manipulate the Occopus tool configuration settings.
 */
@Component({
  selector: 'toil-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent {
  /**
   * The url endpoint of the Occopus tool.
   */
  url: string;

  /**
   * Initializes the needed services.
   * @param occoSVC The main service to handle http communications made to Occopus.
   */
  constructor(public occoSVC: OccoService) {}

  /**
   * When the update button is clicked, the Occopus based http service gets the url.
   */
  onClick() {
    this.occoSVC.url = this.url;
    console.log(this.occoSVC.url);
  }
}
