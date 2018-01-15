import { Component, OnInit } from '@angular/core';

import { FrameworkConfigService } from '../services/framework-config.service';
import { UserApi } from '../users/user-api';

/**
 * Holds the logic for the basic user information display.
 */
@Component({
  selector: 'fw-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent{

  /**
   *Initializes the needed services.
   * @param frameworkConfigService Holds data for the layout configuration options.
   */
  constructor(public frameworkConfigService: FrameworkConfigService,
              private userApi: UserApi) { }

  /**
   * Signs the user out using the authentication api.
   */
  signOut() {
    this.userApi.signOut();
  }

}
