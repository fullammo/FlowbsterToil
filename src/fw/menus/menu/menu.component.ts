import { Component } from '@angular/core';

import { MenuService } from '../../services/menu.service';

/**
 * Holds the logic for rendering the Navigation menu and its related functionalities. Renders the menu on the demanded side of the platform.
 */
@Component({
  selector: 'fw-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  /**
   *Initialize the needed services.
   * @param menuService The menu related data and its functionalities in a singleton service.
   */
  constructor(public menuService: MenuService) {}
}
