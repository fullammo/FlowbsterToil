import { Component, OnInit } from '@angular/core';

import { MenuService } from '../services/menu.service';
import { ScreenService } from '../services/screen.service';

/**
 * Renders the view of the self made menu component and the container element
 * for business requirement logic.
 */
@Component({
  selector: 'fw-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent {
  /**
   * Initialize the needed services.
   * @param menuService Functionalities provided to interact with the menubar-
   * @param screenService Functionalties provided to adjust the screen based on the window size.
   */
  constructor(
    public menuService: MenuService,
    public screenService: ScreenService
  ) {}
}
