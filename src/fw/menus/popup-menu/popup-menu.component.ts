import { Component, Input } from '@angular/core';

import { MenuItem, MenuService } from '../../services/menu.service';

/**
 * Holds the logic for rendering the menu items in a popup fashion.
 */
@Component({
  selector: 'fw-popup-menu',
  templateUrl: './popup-menu.component.html',
  styleUrls: ['./popup-menu.component.css']
})
export class PopupMenuComponent {

  /**
   * The menu items collection that is provided by the parent component.
   */
  @Input() menu: Array<MenuItem>;

  /**
   * Initialize the needed services.
   */
  constructor(private menuService: MenuService) {}
}
